<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/admin/products">Back</v-btn>
    
    <v-card v-if="loadingData" class="pa-6 mt-4 text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2">Loading product data...</p>
    </v-card>

    <v-card v-else class="pa-6 mt-4">
      <h2 class="mb-4">Edit Component: {{ product?.name }}</h2>
      <ProductForm 
        v-if="product"
        :initial-data="product" 
        :is-edit="true" 
        :loading="submitting" 
        @submit="handleUpdate" 
      />
      <v-alert v-else type="error" text="Product not found."></v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { productService } from '@/services/product.service';
import ProductForm from '@/components/admin/ProductForm.vue';

const router = useRouter();
const route = useRoute(); // Access the :id from the URL

const product = ref(null);
const loadingData = ref(true);
const submitting = ref(false);

// Fetch the product by the ID in the route params when component mounts
onMounted(async () => {
  try {
    const productId = route.params.id;
    const response = await productService.getById(productId);
    product.value = response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
  } finally {
    loadingData.value = false;
  }
});

const handleUpdate = async (formData) => {
  submitting.value = true;
  try {
    const productId = route.params.id;
    await productService.update(productId, formData);
    // Success: Go back to the list
    router.push('/admin/products');
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Failed to update product. Please check the console.");
  } finally {
    submitting.value = false;
  }
};
</script>