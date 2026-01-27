import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useRouter } from "vue-router";
import PCBuilder from "@/views/PCBuilder.vue";
import { usePCBuilderStore } from "@/stores/pcBuilder";
import { useAuthStore } from "@/stores/auth";

// --- 1. GLOBAL ROUTER MOCK ---
const pushSpy = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: pushSpy,
  }),
}));

const UIStubs = {
  ProductCard: {
    template: '<div class="product-card" @click="$emit(\'click\')"></div>',
    props: ["name", "price", "stock", "category", "imageUrl", "showAddToCart"],
  },
  Button: {
    template:
      '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
    props: ["disabled"],
  },
  Input: {
    template:
      "<input @input=\"$emit('update:modelValue', $event.target.value)\" />",
    props: ["modelValue"],
  },
  Stepper: { template: "<div />" },
  Icon: { template: "<span />" },
};

describe("PCBuilder.vue", () => {
  let wrapper;
  let builderStore;
  let authStore;

  beforeEach(() => {
    vi.clearAllMocks();

    wrapper = mount(PCBuilder, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
        stubs: {
          ...UIStubs,
          RouterLink: true,
        },
      },
    });

    builderStore = usePCBuilderStore();
    authStore = useAuthStore();

    // Setup Store Basics
    builderStore.isLoading = false;
    builderStore.steps = [{ id: "cpu", label: "CPU" }];
    builderStore.currentStepIndex = 0;
    builderStore.currentStep = builderStore.steps[0];
    builderStore.selectedParts = {};
    builderStore.availableComponents = [
      { id: 1, name: "Intel i9", price: 500, category: { name: "CPU" } },
      { id: 2, name: "AMD Ryzen 9", price: 450, category: { name: "CPU" } },
    ];

    // IMPORTANT: Set getters manually
    builderStore.allPartsSelected = false;

    // Mock Actions
    builderStore.initBuilder.mockResolvedValue();
    builderStore.saveBuild.mockResolvedValue({ success: true });
    builderStore.transferBuildToCart.mockResolvedValue({ success: true });
  });

  it("initializes the builder on mount", () => {
    expect(builderStore.initBuilder).toHaveBeenCalled();
  });

  it("renders available components correctly", async () => {
    await wrapper.vm.$nextTick();
    const cards = wrapper.findAllComponents(UIStubs.ProductCard);
    expect(cards).toHaveLength(2);
  });

  it("selects a component when clicked", async () => {
    await wrapper.vm.$nextTick();
    const card = wrapper.findAllComponents(UIStubs.ProductCard)[0];
    await card.trigger("click");
    expect(builderStore.selectPart).toHaveBeenCalledWith(
      "cpu",
      expect.anything(),
    );
  });

  it("removes a selected part via sidebar", async () => {
    // 1. Select a part first
    const part = builderStore.availableComponents[0];
    builderStore.selectedParts = { cpu: part };
    await wrapper.vm.$nextTick();

    // 2. Find remove button in sidebar (red x)
    const removeBtn = wrapper.find("button.text-red-500");
    expect(removeBtn.exists()).toBe(true);

    await removeBtn.trigger("click");
    expect(builderStore.removePart).toHaveBeenCalledWith("cpu");
  });

  it("renders empty state when no components available", async () => {
    builderStore.availableComponents = []; // Empty list
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("No components available");
    expect(wrapper.findAllComponents(UIStubs.ProductCard)).toHaveLength(0);
  });

  it("shows alert when save fails", async () => {
    // Mock failure response
    builderStore.saveBuild.mockResolvedValue({
      success: false,
      error: "Database Error",
    });
    authStore.token = "valid-token";
    builderStore.allPartsSelected = true;
    window.alert = vi.fn(); // Spy on alert

    await wrapper.vm.$nextTick();

    // Trigger save flow
    const saveBtn = wrapper
      .findAllComponents(UIStubs.Button)
      .find((b) => b.text().includes("Save Build"));
    await saveBtn.trigger("click");

    // Fill modal and confirm
    const input = wrapper.findComponent(UIStubs.Input);
    await input.setValue("Fail Build");
    const modalSaveBtn = wrapper
      .findAllComponents(UIStubs.Button)
      .filter((b) => b.text().includes("Save"))
      .at(-1);
    await modalSaveBtn.trigger("click");
    await flushPromises();

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("Failed to save"),
    );
  });

  describe("Save/Buy Flow", () => {
    it("redirects to login if user clicks Buy Now while unauthenticated", async () => {
      // We use Buy Now because it checks auth immediately, unlike Save which opens a modal first
      authStore.token = null;
      builderStore.allPartsSelected = true;
      await wrapper.vm.$nextTick();

      const buyBtn = wrapper
        .findAllComponents(UIStubs.Button)
        .find((b) => b.text().includes("Buy Now"));

      await buyBtn.trigger("click");

      expect(pushSpy).toHaveBeenCalledWith("/login");
    });

    it("opens modal, inputs name, and saves successfully", async () => {
      authStore.token = "valid-token";
      builderStore.allPartsSelected = true;
      await wrapper.vm.$nextTick();

      const saveBtn = wrapper
        .findAllComponents(UIStubs.Button)
        .find((b) => b.text().includes("Save Build"));

      await saveBtn.trigger("click");
      expect(wrapper.find(".fixed").exists()).toBe(true);

      const input = wrapper.findComponent(UIStubs.Input);
      await input.setValue("My Gaming PC");

      const modalSaveBtn = wrapper
        .findAllComponents(UIStubs.Button)
        .filter((b) => b.text().includes("Save"))
        .at(-1);

      await modalSaveBtn.trigger("click");
      await flushPromises();

      expect(builderStore.saveBuild).toHaveBeenCalledWith("My Gaming PC");
      expect(pushSpy).toHaveBeenCalledWith("/saved-builds");
    });

    it("saves then transfers to cart", async () => {
      authStore.token = "valid-token";
      builderStore.allPartsSelected = true;
      builderStore.savedBuilds = [{ id: 99, name: "Quick Build" }];
      await wrapper.vm.$nextTick();

      const buyBtn = wrapper
        .findAllComponents(UIStubs.Button)
        .find((b) => b.text().includes("Buy Now"));

      await buyBtn.trigger("click");
      await flushPromises();

      expect(builderStore.saveBuild).toHaveBeenCalled();
      expect(builderStore.transferBuildToCart).toHaveBeenCalledWith(99);
      expect(pushSpy).toHaveBeenCalledWith("/checkout");
    });
  });
});
