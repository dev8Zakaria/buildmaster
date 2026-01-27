import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import SavedBuilds from "@/views/SavedBuilds.vue";
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
  Button: { template: "<button @click=\"$emit('click')\"><slot /></button>" },
  Icon: { template: "<span />" },
};

describe("SavedBuilds.vue", () => {
  let wrapper;
  let builderStore;

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);

    wrapper = mount(SavedBuilds, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
              auth: { token: "valid-token" },
              pcBuilder: { savedBuilds: [] },
            },
          }),
        ],
        stubs: {
          ...UIStubs,
          RouterLink: true,
        },
      },
    });

    builderStore = usePCBuilderStore();

    // Mock Action Implementations
    builderStore.fetchSavedBuilds.mockResolvedValue();
    builderStore.getSavedBuildById.mockResolvedValue({
      id: 1,
      name: "Super PC",
      total_price: 2000,
      createdAt: "2023-01-01",
      components: [],
    });
    builderStore.deleteSavedBuild.mockResolvedValue({ success: true });
    builderStore.transferBuildToCart.mockResolvedValue({ success: true });
  });

  it("fetches builds on mount if authenticated", () => {
    expect(builderStore.fetchSavedBuilds).toHaveBeenCalled();
  });

  it("redirects to login on mount if no token", async () => {
    wrapper.unmount();
    wrapper = mount(SavedBuilds, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
              auth: { token: null },
            },
          }),
        ],
        stubs: { ...UIStubs, RouterLink: true },
      },
    });

    expect(pushSpy).toHaveBeenCalledWith("/login");
  });

  it("renders empty state when no builds exist", async () => {
    builderStore.isLoading = false; // Force loading off
    builderStore.savedBuilds = [];
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("No Saved Builds");
  });

  it("renders list of builds", async () => {
    builderStore.isLoading = false; // FIX: Force loading off so list appears
    builderStore.savedBuilds = [
      {
        id: 1,
        name: "My First Build",
        total_price: 1000,
        createdAt: "2023-01-01",
      },
    ];
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("My First Build");
  });

  describe("Interactions", () => {
    beforeEach(async () => {
      builderStore.isLoading = false; // FIX: Ensure list is visible for interactions
      builderStore.savedBuilds = [
        {
          id: 1,
          name: "Test Build",
          total_price: 1000,
          createdAt: "2023-01-01",
        },
      ];
      await wrapper.vm.$nextTick();
    });

    it("opens details modal when View is clicked", async () => {
      const viewBtn = wrapper
        .findAllComponents(UIStubs.Button)
        .find((b) => b.text().includes("View"));

      // This will now work because isLoading=false allowed the list (and buttons) to render
      await viewBtn.trigger("click");
      expect(wrapper.vm.showDetailModal).toBe(true);
    });

    it("handles Delete flow", async () => {
      wrapper.vm.selectedBuild = { id: 1 };
      wrapper.vm.showDetailModal = true;
      await wrapper.vm.$nextTick();

      const deleteBtn = wrapper
        .findAllComponents(UIStubs.Button)
        .find((b) => b.text().includes("Delete"));

      await deleteBtn.trigger("click");

      expect(builderStore.deleteSavedBuild).toHaveBeenCalledWith(1);
    });

    it("handles Buy Now directly from list", async () => {
      const buyBtn = wrapper
        .findAllComponents(UIStubs.Button)
        .find((b) => b.text().includes("Buy Now"));

      await buyBtn.trigger("click");
      await flushPromises();

      expect(builderStore.transferBuildToCart).toHaveBeenCalledWith(1);
      expect(pushSpy).toHaveBeenCalledWith("/checkout");
    });

    it("does NOT delete if user cancels confirmation", async () => {
      // 1. Mock confirm to return FALSE (User clicked Cancel)
      window.confirm = vi.fn(() => false);

      wrapper.vm.selectedBuild = { id: 1 };
      wrapper.vm.showDetailModal = true;
      await wrapper.vm.$nextTick();

      const deleteBtn = wrapper
        .findAllComponents(UIStubs.Button)
        .find((b) => b.text().includes("Delete"));

      await deleteBtn.trigger("click");

      expect(window.confirm).toHaveBeenCalled();
      expect(builderStore.deleteSavedBuild).not.toHaveBeenCalled(); // Should NOT call store
    });

    it("shows alert if buy now transfer fails", async () => {
      // Mock failure
      builderStore.transferBuildToCart.mockResolvedValue({
        success: false,
        error: "Out of stock",
      });
      window.alert = vi.fn();

      const buyBtn = wrapper
        .findAllComponents(UIStubs.Button)
        .find((b) => b.text().includes("Buy Now"));

      await buyBtn.trigger("click");
      await flushPromises();

      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining("Failed to transfer"),
      );
      // Should NOT redirect
      expect(pushSpy).not.toHaveBeenCalled();
    });
  });
});
