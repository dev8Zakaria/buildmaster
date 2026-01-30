import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import SavedBuilds from '@/views/SavedBuilds.vue'; // Ensure filename matches
import { usePCBuilderStore } from '@/stores/pcBuilder';
import { useAuthStore } from '@/stores/auth';

// --- Global Mocks ---
const pushSpy = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushSpy }),
}));

const UIStubs = {
  Button: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  Icon: { template: '<span />' }
};

describe('SavedBuilds.vue', () => {
  let wrapper;
  let builderStore;

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true); // Default to "OK" for confirms
    window.alert = vi.fn();

    wrapper = mount(SavedBuilds, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
          initialState: {
            auth: { token: 'valid-token' }, 
            pcBuilder: { savedBuilds: [] }
          }
        })],
        stubs: { ...UIStubs, RouterLink: true }
      }
    });

    builderStore = usePCBuilderStore();
    
    // Mock Actions
    builderStore.fetchSavedBuilds.mockResolvedValue();
    builderStore.getSavedBuildById.mockResolvedValue({
        id: 1, 
        name: 'Super PC', 
        total_price: 2000, 
        createdAt: '2023-01-01',
        components: []
    });
    builderStore.deleteSavedBuild.mockResolvedValue({ success: true });
    builderStore.transferBuildToCart.mockResolvedValue({ success: true });
  });

  // --- INITIALIZATION ---

  it('fetches builds on mount if authenticated', () => {
    expect(builderStore.fetchSavedBuilds).toHaveBeenCalled();
  });

  it('redirects to login on mount if no token', async () => {
    wrapper.unmount();
    wrapper = mount(SavedBuilds, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
          initialState: { auth: { token: null } }
        })],
        stubs: { ...UIStubs, RouterLink: true }
      }
    });
    
    expect(pushSpy).toHaveBeenCalledWith('/login');
  });

  it('renders empty state when no builds exist', async () => {
    builderStore.isLoading = false;
    builderStore.savedBuilds = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('No Saved Builds');
  });

  it('renders list of builds', async () => {
    builderStore.isLoading = false;
    builderStore.savedBuilds = [
        { id: 1, name: 'My First Build', total_price: 1000, createdAt: '2023-01-01' }
    ];
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('My First Build');
  });

  // --- INTERACTIONS ---

  describe('Interactions', () => {
    beforeEach(async () => {
      builderStore.isLoading = false;
      builderStore.savedBuilds = [
          { id: 1, name: 'Test Build', total_price: 1000, createdAt: '2023-01-01' }
      ];
      await wrapper.vm.$nextTick();
    });

    it('opens details modal when View is clicked', async () => {
        const viewBtn = wrapper.findAllComponents(UIStubs.Button)
            .find(b => b.text().includes('View'));
        
        await viewBtn.trigger('click');
        expect(wrapper.vm.showDetailModal).toBe(true);
    });

    it('handles Delete flow (User Confirms)', async () => {
        // Open modal
        wrapper.vm.selectedBuild = { id: 1 };
        wrapper.vm.showDetailModal = true;
        await wrapper.vm.$nextTick();

        const deleteBtn = wrapper.findAllComponents(UIStubs.Button)
            .find(b => b.text().includes('Delete'));
        
        await deleteBtn.trigger('click');

        expect(window.confirm).toHaveBeenCalled();
        expect(builderStore.deleteSavedBuild).toHaveBeenCalledWith(1);
        expect(wrapper.vm.showDetailModal).toBe(false); // Modal should close
    });

    it('does NOT delete if user Cancels confirmation', async () => {
        window.confirm = vi.fn(() => false); // User clicks "Cancel"
        
        wrapper.vm.selectedBuild = { id: 1 };
        wrapper.vm.showDetailModal = true;
        await wrapper.vm.$nextTick();

        const deleteBtn = wrapper.findAllComponents(UIStubs.Button)
            .find(b => b.text().includes('Delete'));
        
        await deleteBtn.trigger('click');

        expect(window.confirm).toHaveBeenCalled();
        expect(builderStore.deleteSavedBuild).not.toHaveBeenCalled();
    });

    it('handles Buy Now success', async () => {
        const buyBtn = wrapper.findAllComponents(UIStubs.Button)
            .find(b => b.text().includes('Buy Now'));
        
        await buyBtn.trigger('click');
        await flushPromises();

        expect(builderStore.transferBuildToCart).toHaveBeenCalledWith(1);
        expect(pushSpy).toHaveBeenCalledWith('/checkout');
    });

    it('shows alert if Buy Now transfer fails', async () => {
        builderStore.transferBuildToCart.mockResolvedValue({ success: false, error: 'System Error' });

        const buyBtn = wrapper.findAllComponents(UIStubs.Button)
            .find(b => b.text().includes('Buy Now'));
        
        await buyBtn.trigger('click');
        await flushPromises();

        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Failed to transfer'));
        expect(pushSpy).not.toHaveBeenCalled(); 
    });
  });
});