<template>
  <v-container>
    <v-row class="mb-4" align="center">
      <v-col><h1>Product Management</h1></v-col>
      <v-col class="text-right">
        <v-btn color="success" prepend-icon="mdi-plus" to="/admin/products/add">New Product</v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-data-table :headers="headers" :items="products" :loading="loading">
        <template v-slot:item.stock="{ value }">
          <v-chip :color="value < 5 ? 'red' : 'green'" size="small">
            {{ value }} {{ value < 5 ? '(Low)' : '' }}
          </v-chip>
        </template>
        
        <template v-slot:item.price="{ value }">
          ${{ parseFloat(value).toFixed(2) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-2" @click="editProduct(item.id)">mdi-pencil</v-icon>
          <v-icon size="small" color="error" @click="confirmDelete(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card title="Confirm Delete">
        <v-card-text>Are you sure you want to delete {{ selectedProduct?.name }}?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="doDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { productService } from '@/services/product.service';

const router = useRouter();
const products = ref([]);
const loading = ref(true);
const deleteDialog = ref(false);
const selectedProduct = ref(null);

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Brand', key: 'brand' },
  { title: 'Stock', key: 'stock' },
  { title: 'Price', key: 'price' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const loadProducts = async () => {
  loading.value = true;
  const res = await productService.getAll();
  products.value = res.data;
  loading.value = false;
};

const editProduct = (id) => router.push(`/admin/products/${id}/edit`);

const confirmDelete = (product) => {
  selectedProduct.value = product;
  deleteDialog.value = true;
};

const doDelete = async () => {
  await productService.delete(selectedProduct.value.id);
  deleteDialog.value = false;
  loadProducts();
};

onMounted(loadProducts);
</script>