<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import TopBar from '@/components/admin/TopBar.vue';
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
    
    if (!category) return [];
    
    // Try exact match first
    let specs = COMPONENT_SPECS[category.name];
    
    // If not found, try trimmed version
    if (!specs || specs.length === 0) {
        specs = COMPONENT_SPECS[category.name.trim()];
    }
    
    return specs || [];
});

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

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
    } else {
        selectedFile.value = null;
    }
};

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
            imageUrl: item.ImageUrl, 
            specifications: (() => {
                const specs = { ...item.specifications } || {};
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
            const formData = new FormData();
            formData.append('name', compForm.value.name || '');
            formData.append('brand', compForm.value.brand || '');
            formData.append('price', compForm.value.price || '0');
            formData.append('stock', compForm.value.stock || '0');
            
            const catId = compForm.value.categoryId ? String(compForm.value.categoryId) : '';
            formData.append('categoryId', catId);
            formData.append('categoryid', catId); 
            
            const specs = {};
            const sourceSpecs = compForm.value.specifications || {};

            currentSpecs.value.forEach(def => {
                let value = sourceSpecs[def.key];
                if (value !== undefined && value !== null && value !== '') {
                    if (def.type === 'array' && typeof value === 'string') {
                        value = value.split(',').map(s => s.trim()).filter(s => s);
                    } else if (def.type === 'number') {
                        const num = parseFloat(value);
                        if (!isNaN(num)) value = num;
                    }
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
                await adminStore.updateCategory(editingId.value, catForm.value);
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
        showModal.value = false;
    } catch (e) {
        alert("Delete failed: " + e);
    }
};

watch(() => compForm.value.categoryId, (newVal, oldVal) => {
    if (modalMode.value === 'create' && newVal !== oldVal) {
        compForm.value.specifications = {};
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
        <TopBar />

        <main class="max-w-[1600px] mx-auto p-6 space-y-8">
            
            <!-- Header Area -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 class="text-4xl font-black tracking-tighter text-gray-900 mb-2" style="font-family: 'Outfit', sans-serif;">
                        INVENTORY CORE
                    </h2>
                    <div class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest" style="font-family: 'JetBrains Mono', monospace;">
                        <span class="text-amber-600">Warehouse Database</span>
                        <span>//</span>
                        <span>{{ adminStore.components.length }} Units Logged</span>
                    </div>
                </div>

                <!-- Controls -->
                <div class="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                    <button 
                        @click="activeTab = 'components'"
                        class="px-5 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2"
                        :class="activeTab === 'components' 
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'"
                    >
                        <Icon icon="mdi:chip" />
                        Components
                    </button>
                    <button 
                        @click="activeTab = 'categories'"
                        class="px-5 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2"
                        :class="activeTab === 'categories' 
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'"
                    >
                        <Icon icon="mdi:shape" />
                        Categories
                    </button>
                </div>

                <button 
                    @click="openCreateModal" 
                    class="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                >
                    <Icon icon="mdi:plus" class="text-xl" />
                    <span>ADD ITEM</span>
                </button>
            </div>

            <!-- Content Area -->
            <div v-if="activeTab === 'components'">
                 <div v-if="adminStore.isLoading" class="flex justify-center p-20">
                    <Icon icon="eos-icons:loading" class="text-5xl text-amber-500 animate-spin" />
                </div>
                
                <div v-else-if="componentsWithCategoryName.length === 0" class="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
                     <Icon icon="mdi:package-variant" class="text-6xl text-gray-300 mx-auto mb-4" />
                    <p class="text-lg font-bold text-gray-500">Inventory Empty</p>
                </div>
                
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    <div 
                        v-for="item in componentsWithCategoryName" 
                        :key="item.id"
                        @click="openEditModal(item)"
                        class="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer"
                    >
                        <!-- Image Area -->
                        <div class="aspect-square bg-gray-50 p-6 flex items-center justify-center relative overlow-hidden">
                            <img 
                                v-if="item.ImageUrl" 
                                :src="item.ImageUrl" 
                                class="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
                            />
                            <Icon v-else icon="mdi:chip" class="text-6xl text-gray-200" />
                            
                            <!-- Stock Badge -->
                            <div class="absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur border border-gray-200"
                                :class="item.stock < 10 ? 'text-red-500' : 'text-emerald-500'">
                                {{ item.stock }} UNITS
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="p-4">
                             <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                                {{ item.categoryName }}
                            </p>
                            <h3 class="font-bold text-gray-900 leading-tight mb-1 truncate">{{ item.name }}</h3>
                            <p class="text-xs text-gray-500 mb-3">{{ item.brand }}</p>
                            
                            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                                <span class="text-lg font-black text-gray-900 font-mono">${{ item.price }}</span>
                                <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                    <Icon icon="mdi:pencil" class="text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Categories Tab (Custom Tech Table) -->
            <div v-else class="space-y-4">
                 <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <!-- Table Header -->
                    <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-500 tracking-wider">
                        <div class="col-span-4">Category Name</div>
                        <div class="col-span-6">Description</div>
                        <div class="col-span-2 text-right">Products</div>
                    </div>

                    <!-- Table Body -->
                    <div class="divide-y divide-gray-100">
                        <div 
                            v-for="cat in adminStore.categoryStats" 
                            :key="cat.id"
                            @click="openEditModal(cat)"
                            class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-amber-50/50 cursor-pointer transition-colors group"
                        >
                            <div class="col-span-4 font-bold text-gray-900 flex items-center gap-3">
                                <div class="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-amber-500 transition-colors">
                                    <Icon icon="mdi:shape" />
                                </div>
                                {{ cat.name }}
                            </div>
                            <div class="col-span-6 text-sm text-gray-500 truncate">
                                {{ cat.description || 'No description' }}
                            </div>
                            <div class="col-span-2 text-right">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                                    {{ cat.count }}
                                </span>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

        </main>

        <!-- Dynamic Glass Modal -->
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showModal = false">
            <div class="bg-white w-full max-w-3xl max-h-[85vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-2xl border border-gray-200 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
                
                <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 glass-header">
                    <div>
                        <h2 class="text-2xl font-black tracking-tight text-gray-900" style="font-family: 'Outfit', sans-serif;">
                            {{ modalMode === 'create' ? 'NEW ENTRY' : 'EDIT RECORD' }}
                        </h2>
                        <p class="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
                            {{ activeTab === 'components' ? 'Component Database' : 'Category Database' }}
                        </p>
                    </div>
                    <button @click="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Icon icon="mdi:close" class="text-xl" />
                    </button>
                </div>

                <div class="p-8">
                    <!-- COMPONENT FORM -->
                    <form v-if="activeTab === 'components'" @submit.prevent="handleSubmit" id="modalForm" class="space-y-8">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Left Column -->
                            <div class="space-y-5">
                                <FormGroup label="Identification">
                                    <StyledInput v-model="compForm.name" placeholder="Component Name" required />
                                    <StyledInput v-model="compForm.brand" placeholder="Brand / Manufacturer" required />
                                </FormGroup>

                                <FormGroup label="Inventory Metrics">
                                    <div class="grid grid-cols-2 gap-4">
                                        <StyledInput v-model="compForm.stock" type="number" placeholder="Stock Qty" required />
                                        <StyledInput v-model="compForm.price" type="number" placeholder="Price ($)" required />
                                    </div>
                                </FormGroup>

                                <FormGroup label="Classification">
                                     <select 
                                        v-model="compForm.categoryId"
                                        class="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none font-mono text-sm text-gray-900"
                                     >
                                        <option :value="null" disabled>Select Category</option>
                                        <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
                                            {{ opt.label }}
                                        </option>
                                     </select>
                                </FormGroup>
                            </div>

                            <!-- Right Column -->
                            <div class="space-y-5">
                                <FormGroup label="Visual Asset">
                                    <div class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-amber-500 transition-colors relative group">
                                        <input type="file" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <Icon icon="mdi:cloud-upload" class="text-3xl text-gray-400 mb-2 group-hover:text-amber-500 transition-colors" />
                                        <p class="text-sm font-medium text-gray-500">
                                            {{ selectedFile ? selectedFile.name : 'Drop image or click to browse' }}
                                        </p>
                                    </div>
                                    <div v-if="compForm.imageUrl" class="text-xs text-center text-gray-400 mt-2 truncate max-w-xs mx-auto">
                                        Current: {{ compForm.imageUrl }}
                                    </div>
                                </FormGroup>

                                <div v-if="compForm.categoryId" class="pt-4 border-t border-gray-200">
                                    <h3 class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4 font-mono">Tech Specs</h3>
                                    <div v-if="currentSpecs.length > 0" class="space-y-3">
                                        <div v-for="spec in currentSpecs" :key="spec.key" class="flex items-center gap-3">
                                            <span class="text-xs font-semibold w-1/3 truncate text-right text-gray-500">{{ spec.label }}</span>
                                            <StyledInput 
                                                v-model="compForm.specifications[spec.key]" 
                                                :placeholder="spec.placeholder" 
                                                class="flex-1 !py-2 !text-xs"
                                            />
                                        </div>
                                    </div>
                                    <p v-else class="text-xs text-gray-400 italic text-center">No specs defined</p>
                                </div>
                            </div>
                        </div>
                    </form>

                    <!-- CATEGORY FORM -->
                    <form v-else @submit.prevent="handleSubmit" id="modalForm" class="space-y-6 max-w-md mx-auto">
                        <FormGroup label="Category Details">
                            <StyledInput v-model="catForm.name" placeholder="Category Name" required />
                            <StyledInput v-model="catForm.description" placeholder="Short Description" />
                        </FormGroup>
                    </form>
                </div>

                <!-- Footer -->
                <div class="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center sticky bottom-0 z-10">
                    <button 
                        v-if="modalMode === 'edit'"
                        type="button" 
                        @click="handleDelete(editingId)"
                        class="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider flex items-center gap-2"
                    >
                        <Icon icon="mdi:trash-can-outline" class="text-lg" />
                        Delete Record
                    </button>
                    <div v-else></div>

                    <div class="flex gap-4">
                        <button type="button" @click="showModal = false" class="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                            CANCEL
                        </button>
                        <button 
                            type="submit" 
                            form="modalForm" 
                            :disabled="adminStore.isLoading"
                            class="px-8 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-lg shadow-lg hover:shadow-orange-500/25 transition-all text-sm uppercase tracking-wide"
                        >
                            {{ modalMode === 'create' ? 'Create Entry' : 'Save Changes' }}
                        </button>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<!-- Local sub-components for cleaner template (Internal usage) -->
<script>
import { h } from 'vue';

const FormGroup = (props, { slots }) => h('div', { class: 'space-y-3' }, [
    h('label', { class: 'block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono' }, props.label),
    h('div', { class: 'space-y-3' }, slots.default())
]);

const StyledInput = (props, { attrs }) => h('input', {
    ...attrs,
    class: `w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all 
            font-mono text-sm placeholder-gray-400 text-gray-900 ${attrs.class || ''}`,
    onInput: (e) => props['onUpdate:modelValue'](e.target.value)
});

export default { components: { FormGroup, StyledInput } };
</script>
