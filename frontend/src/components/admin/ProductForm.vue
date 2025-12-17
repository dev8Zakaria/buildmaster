<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submit">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field 
          v-model="formData.name" 
          label="Product Name" 
          :rules="[v => !!v || 'Required']" 
          required 
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select 
          v-model.number="formData.categoryId" 
          :items="categories" 
          item-title="name" 
          item-value="id" 
          label="Category" 
          :rules="[v => !!v || 'Required']"
          required 
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="formData.brand" label="Brand" required />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field 
          v-model.number="formData.price" 
          label="Price" 
          type="number" 
          prefix="$" 
          required 
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field 
          v-model.number="formData.stock" 
          label="Stock" 
          type="number" 
          required 
        />
      </v-col>
      
      <v-col cols="12">
        <v-textarea 
          v-model="specString" 
          label="Specifications (JSON)" 
          hint="Format: { 'socket': 'AM4', 'tdp': '65W' }" 
          persistent-hint 
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" class="d-flex justify-end gap-2">
        <v-btn variant="text" to="/admin/products" class="mr-2">Cancel</v-btn>
        <v-btn 
          color="primary" 
          :loading="loading" 
          :disabled="!valid" 
          type="submit"
        >
          {{ isEdit ? 'Update Product' : 'Create Product' }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { productService } from '@/services/product.service';

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isEdit: Boolean,
  loading: Boolean
});

const emit = defineEmits(['submit']);
const valid = ref(false);
const categories = ref([]);

// Local form state
const formData = ref({ ...props.initialData });
const specString = ref(JSON.stringify(props.initialData.specifications || {}, null, 2));

/**
 * CRITICAL: Watch for prop changes.
 * When EditProduct.vue finishes fetching data, initialData changes.
 * We must update our local formData to reflect the fetched data.
 */
watch(() => props.initialData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    formData.value = { ...newVal };
    specString.value = JSON.stringify(newVal.specifications || {}, null, 2);
  }
}, { deep: true, immediate: true });

onMounted(async () => {
  try {
    const res = await productService.getCategories();
    categories.value = res.data;
  } catch (err) {
    console.error("Failed to load categories", err);
  }
});

const submit = () => {
  try {
    // Parse the string back into a JSON object for the DB
    const parsedSpecs = JSON.parse(specString.value);
    
    // Create a clean payload (removing extra Prisma fields if necessary)
    const payload = {
      ...formData.value,
      specifications: parsedSpecs
    };

    emit('submit', payload);
  } catch (e) {
    alert("Invalid JSON format in specifications. Please check your brackets and quotes.");
  }
};
</script>