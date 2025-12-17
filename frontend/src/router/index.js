import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Adjust path as needed
import Home from '../views/Home.vue';
import SignIn from '../views/auth/SignIn.vue';
import SignUp from '../views/auth/SignUp.vue';

// Admin Views
import ProductsList from '../views/admin/ProductsList.vue';
import AddProduct from '../views/admin/AddProduct.vue';
import EditProduct from '../views/admin/EditProduct.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'SignIn', component: SignIn },
  { path: '/signup', name: 'SignUp', component: SignUp },
  
  // --- Admin Routes ---
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: ProductsList,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/products/add',
    name: 'AddProduct',
    component: AddProduct,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/products/:id/edit',
    name: 'EditProduct',
    component: EditProduct,
    props: true,
    meta: { requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAdmin = authStore.user?.role === 'Admin';

  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (isAdmin) {
      next();
    } else {
      // Not an admin? Redirect to Home or Login
      next({ name: 'Home' });
    }
  } else {
    next();
  }
});

export default router;