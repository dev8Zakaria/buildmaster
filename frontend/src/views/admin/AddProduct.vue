<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/admin/products">Back</v-btn>
    <v-card class="pa-6 mt-4">
      <h2 class="mb-4">Add New Component</h2>
      <ProductForm @submit="handleCreate" :loading="loading" />
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { productService } from '@/services/product.service';
import ProductForm from '@/components/admin/ProductForm.vue';

const router = useRouter();
const loading = ref(false);

const handleCreate = async (data) => {
  loading.value = true;
  await productService.create(data);
  router.push('/admin/products');
};
</script>