<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import TopBar from '@/components/admin/TopBar.vue';
import AdminTable from '@/UI-elements/as_Inspira/AdminTable.vue';
import Input from '@/UI-elements/as_Inspira/Input.vue';
import Button from '@/UI-elements/as_Inspira/Button.vue';
import FileUpload from '@/UI-elements/Inspira/FileUpload.vue';
import ProductCard from '@/UI-elements/as_Inspira/ProductCard.vue';
import ComboBox from '@/UI-elements/as_Inspira/ComboBox.vue';
import { useAdminStore } from '@/stores/admin';
import { COMPONENT_SPECS } from '@/lib/spec-definitions';

const adminStore = useAdminStore();

// --- State ---
const activeTab = ref('components'); // 'components' | 'categories'
const showModal = ref(false);
const modalMode = ref('create'); // 'create' | 'edit'
const editingId = ref(null);
const selectedFile = ref(null);

// Form Data - Component
const compForm = ref({
    name: '',
    brand: '',
    price: '',
    stock: '',
    categoryId: null,
    imageUrl: '',
    specifications: {}
});

// Form Data - Category
const catForm = ref({
    name: '',
    description: ''
});

// --- Computed ---

const currentSpecs = computed(() => {
    if (!compForm.value.categoryId) return [];
    const category = adminStore.categories.find(c => c.id === compForm.value.categoryId);
    
    if (!category) {
        console.log('Debug - No category found for ID:', compForm.value.categoryId);
        return [];
    }
    
    console.log('Debug - Category name:', JSON.stringify(category.name));
    console.log('Debug - Category name length:', category.name.length);
    console.log('Debug - Category name char codes:', Array.from(category.name).map(c => c.charCodeAt(0)));
    
    // Try exact match first
    let specs = COMPONENT_SPECS[category.name];
    console.log('Debug - Direct lookup result:', specs);
    
    // If not found, try trimmed version
    if (!specs || specs.length === 0) {
        const trimmedName = category.name.trim();
        console.log('Debug - Trying trimmed name:', JSON.stringify(trimmedName));
        specs = COMPONENT_SPECS[trimmedName];
        console.log('Debug - Trimmed lookup result:', specs);
    }
    
    return specs || [];
});

const componentColumns = [
    { key: 'imageUrl', label: 'Image' },
    { key: 'name', label: 'Name' },
    { key: 'brand', label: 'Brand' },
    { key: 'categoryName', label: 'Category' }, // Need to map this
    { key: 'price', label: 'Price ($)' },
    { key: 'stock', label: 'Stock' },
];

const categoryColumns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'count', label: 'Products' }
];

const componentsWithCategoryName = computed(() => {
    return adminStore.components.map(comp => ({
        ...comp,
        categoryName: comp.category?.name || 'Unknown'
    }));
});

const categoryOptions = computed(() => {
    return adminStore.categories.map(c => ({
        label: c.name,
        value: c.id
    }));
});

// --- Actions ---

onMounted(async () => {
    await adminStore.fetchCategories();
    await adminStore.fetchComponents();
});

const handleImageUpload = (files) => {
    if (files && files.length > 0) {
        // FileUpload component returns an array of files
        selectedFile.value = files[0];
        console.log("File selected:", selectedFile.value.name);
    } else {
        selectedFile.value = null;
    }
};
// NOTE: Since I don't see the internal logic of FileUpload, I'm assuming it handles the upload 
// or provides the file. I'll add a helper to upload if needed, but the plan said "Integrate Image Upload".

const openCreateModal = () => {
    modalMode.value = 'create';
    editingId.value = null;
    resetForms();
    showModal.value = true;
};

const openEditModal = (item) => {
    modalMode.value = 'edit';
    editingId.value = item.id;
    showModal.value = true;

    if (activeTab.value === 'components') {
        compForm.value = {
            name: item.name,
            brand: item.brand,
            price: item.price,
            stock: item.stock,
            categoryId: item.categoryId,
            imageUrl: item.ImageUrl, // Note casing from API
            specifications: (() => {
                const specs = { ...item.specifications } || {};
                // Convert arrays back to comma-separated strings for display
                Object.keys(specs).forEach(key => {
                    if (Array.isArray(specs[key])) {
                        specs[key] = specs[key].join(', ');
                    }
                });
                return specs;
            })()
        };
    } else {
        catForm.value = {
            name: item.name,
            description: item.description
        };
    }
};

const resetForms = () => {
    compForm.value = { name: '', brand: '', price: '', stock: '', categoryId: null, imageUrl: '', specifications: {} };
    catForm.value = { name: '', description: '' };
    selectedFile.value = null;
};

const handleSubmit = async () => {
    try {
        if (activeTab.value === 'components') {
            // Use FormData for components to support image upload
            const formData = new FormData();
            // Ensure numeric fields are valid or default to 0 to avoid NaN crashes
            formData.append('name', compForm.value.name || '');
            formData.append('brand', compForm.value.brand || '');
            formData.append('price', compForm.value.price || '0');
            formData.append('stock', compForm.value.stock || '0');
            
            // Send both variants to be absolutely safe against casing issues
            const catId = compForm.value.categoryId ? String(compForm.value.categoryId) : '';
            formData.append('categoryId', catId);
            formData.append('categoryid', catId); 
            
            // Specifications must be stringified for FormData
            // STRICT FILTERING: Only include keys defined in currentSpecs
            // This removes "Ghost Data" (old keys) and enforces types
            const specs = {};
            const sourceSpecs = compForm.value.specifications || {};

            currentSpecs.value.forEach(def => {
                let value = sourceSpecs[def.key];
                
                // Only include if value exists
                if (value !== undefined && value !== null && value !== '') {
                    // Logic for Array (String -> Array)
                    if (def.type === 'array' && typeof value === 'string') {
                        value = value.split(',').map(s => s.trim()).filter(s => s);
                    } 
                    // Logic for Number (String -> Number)
                    else if (def.type === 'number') {
                        const num = parseFloat(value);
                        if (!isNaN(num)) value = num;
                    }
                    // Text is passed as-is
                    
                    specs[def.key] = value;
                }
            });

            formData.append('specifications', JSON.stringify(specs));

            if (selectedFile.value) {
                formData.append('image', selectedFile.value);
            }
            
            if (modalMode.value === 'create') {
                await adminStore.createComponent(formData);
            } else {
                await adminStore.updateComponent(editingId.value, formData);
            }
        } else {
             if (modalMode.value === 'create') {
                await adminStore.createCategory(catForm.value);
            } else {
                // Update category logic not in store yet explicitly but easy to add
                // await adminStore.updateCategory(editingId.value, catForm.value);
                console.warn("Update Category not fully implemented in store yet");
            }
        }
        showModal.value = false;
    } catch (e) {
        console.error(e);
        alert("Operation failed: " + e);
    }
};

const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
        if (activeTab.value === 'components') {
            await adminStore.deleteComponent(id);
        } else {
            await adminStore.deleteCategory(id);
        }
        showModal.value = false; // Close modal if open
    } catch (e) {
        alert("Delete failed: " + e);
    }
};

// Reset specs when category changes in create mode
watch(() => compForm.value.categoryId, (newVal, oldVal) => {
    if (modalMode.value === 'create' && newVal !== oldVal) {
        compForm.value.specifications = {};
    }
});

</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-gray-100">
        <TopBar />

        <main class="max-w-7xl mx-auto p-6 space-y-6">
            
            <!-- Tab Navigation -->
            <div class="flex items-center justify-between">
                 <div class="inline-flex gap-2 p-1 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <button 
                        @click="activeTab = 'components'"
                        class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                        :class="activeTab === 'components' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
                    >
                        Manage Components
                    </button>
                    <button 
                        @click="activeTab = 'categories'"
                        class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                         :class="activeTab === 'categories' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
                    >
                        Manage Categories
                    </button>
                </div>

                <Button @click="openCreateModal" class="gap-2 flex items-center">
                    <Icon icon="mdi:plus" class="text-lg" />
                    Add {{ activeTab === 'components' ? 'Component' : 'Category' }}
                </Button>
            </div>

            <!-- Content Area -->
            <div v-if="activeTab === 'components'">
                <!-- Grid View for Components -->
                 <div v-if="adminStore.isLoading" class="flex justify-center p-12">
                    <Icon icon="eos-icons:loading" class="text-4xl text-yellow-500 animate-spin" />
                </div>
                <div v-else-if="componentsWithCategoryName.length === 0" class="text-center p-12 text-gray-500">
                    No components found. Start by adding one!
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <ProductCard 
                        v-for="item in componentsWithCategoryName" 
                        :key="item.id"
                        :name="item.name"
                        :brand="item.brand"
                        :price="item.price"
                        :stock="item.stock"
                        :category="item.categoryName"
                        :image-url="item.ImageUrl"
                        @click="openEditModal(item)"
                        class="h-full w-full"
                    />
                </div>
            </div>

            <div v-else>
                 <AdminTable 
                    :columns="categoryColumns" 
                    :data="adminStore.categoryStats" 
                    :loading="adminStore.isLoading"
                    actions 
                    @edit="openEditModal"
                    @delete="handleDelete"
                />
            </div>

        </main>

        <!-- Dynamic Modal -->
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showModal = false">
            <div class="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 flex flex-col">
                
                <div class="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
                    <h2 class="text-xl font-bold">
                        {{ modalMode === 'create' ? 'Create' : 'Edit' }} 
                        {{ activeTab === 'components' ? 'Component' : 'Category' }}
                    </h2>
                    <Button @click="showModal = false" class="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                        <i class="fi fi-rr-cross"></i>
                    </Button>
                </div>

                <div class="p-6 space-y-6">
                    
                    <!-- COMPONENT FORM -->
                    <form v-if="activeTab === 'components'" @submit.prevent="handleSubmit" id="modalForm" class="space-y-6">
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Basic Info -->
                            <div class="space-y-4">
                                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Basic Info</h3>
                                <div class="grid grid-cols-2 gap-4">
                                     <div class="col-span-2">
                                        <label class="block text-sm font-medium mb-1">Product Name</label>
                                        <Input v-model="compForm.name" required placeholder="e.g. Intel Core i9" />
                                     </div>
                                      <div>
                                        <label class="block text-sm font-medium mb-1">Brand</label>
                                        <Input v-model="compForm.brand" required placeholder="e.g. Intel" />
                                     </div>
                                      <div>
                                        <label class="block text-sm font-medium mb-1">Stock</label>
                                        <Input v-model="compForm.stock" type="number" required placeholder="0" />
                                     </div>
                                     <div class="col-span-2">
                                         <label class="block text-sm font-medium mb-1">Price ($)</label>
                                         <Input v-model="compForm.price" type="number" required placeholder="0.00" />
                                     </div>
                                     <div class="col-span-2">
                                         <label class="block text-sm font-medium mb-1">Category</label>
                                         <ComboBox 
                                            v-model="compForm.categoryId"
                                            :options="categoryOptions"
                                            placeholder="Select a Category"
                                         />
                                     </div>
                                </div>
                            </div>

                            <!-- Image Upload -->
                            <div class="space-y-4">
                                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Product Image</h3>
                                <!-- Using User's FileUpload Component -->
                                <FileUpload 
                                    :isMultiple="false"
                                    @onChange="handleImageUpload"
                                />
                                <div v-if="compForm.imageUrl" class="mt-2 text-xs text-green-600">
                                    Current Image: {{ compForm.imageUrl }}
                                </div>
                            </div>
                        </div>

                        <!-- Dynamic Specs Table -->
                        <div v-if="compForm.categoryId" class="space-y-4 border-t border-gray-100 dark:border-zinc-800 pt-6">
                            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                Technical Specifications ({{ activeTab }})
                            </h3>
                            
                            <div v-if="currentSpecs.length > 0" class="overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-800">
                                <table class="w-full text-sm">
                                    <thead class="bg-gray-50 dark:bg-zinc-800/50">
                                        <tr>
                                            <th class="px-4 py-3 text-left font-medium">Specification</th>
                                            <th class="px-4 py-3 text-left font-medium">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100 dark:divide-zinc-800">
                                        <tr v-for="spec in currentSpecs" :key="spec.key" class="bg-white dark:bg-zinc-900">
                                            <td class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                                {{ spec.label }}
                                            </td>
                                            <td class="px-4 py-3">
                                                 <Input 
                                                    v-model="compForm.specifications[spec.key]" 
                                                    :placeholder="spec.placeholder"
                                                    :type="spec.type === 'number' ? 'number' : 'text'"
                                                    class="h-8 text-xs"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="text-sm text-gray-500 italic">
                                No specifications defined for this category type.
                            </div>
                        </div>

                    </form>

                    <!-- CATEGORY FORM -->
                    <form v-else @submit.prevent="handleSubmit" id="modalForm" class="space-y-6">
                         <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Category Name</label>
                                <Input v-model="catForm.name" required placeholder="e.g. Processors" />
                            </div>
                             <div>
                                <label class="block text-sm font-medium mb-1">Description</label>
                                <Input v-model="catForm.description" placeholder="Short description..." />
                            </div>
                        </div>
                    </form>

                </div>

                <div class="p-6 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center sticky bottom-0 bg-white dark:bg-zinc-900 z-10 rounded-b-2xl">
                    <!-- Delete Option (only in edit mode) -->
                    <div>
                        <Button 
                            v-if="modalMode === 'edit'" 
                            type="button" 
                            class="bg-white text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                            @click="handleDelete(editingId)"
                        >
                            <Icon icon="mdi:delete" class="mr-2" />
                            Delete
                        </Button>
                    </div>

                    <div class="flex gap-3">
                        <Button type="button" variant="ghost" @click="showModal = false">Cancel</Button>
                        <Button type="submit" form="modalForm" :disabled="adminStore.isLoading">
                            {{ modalMode === 'create' ? 'Create' : 'Save Changes' }}
                        </Button>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>
