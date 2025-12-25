import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SignIn from '../views/auth/SignIn.vue';
import SignUp from '../views/auth/SignUp.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
    {
        path: '/login',
        name: 'SignIn',
        component: SignIn
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/admin',
        meta: { requiresAuth: true, role: 'Admin' },
        children: [
            {
                path: '',
                name: 'AdminDashboard',
                component: AdminDashboard
            }
        ]
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    // Check if route requires auth
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!authStore.token) {
            next('/login');
            return;
        }
    }

    // Check role requirements
    if (to.matched.some(record => record.meta.role) && authStore.user?.role !== to.meta.role) {
        // If meta is on parent, to.meta might not inherit correctly in all router versions, 
        // but checking matched array is safer.
        // Simplified check:
        const requiredRole = to.matched.find(r => r.meta.role)?.meta.role;
        if (requiredRole && authStore.user?.role !== requiredRole) {
            next('/'); // Redirect unauthorized access to home
            return;
        }
    }

    // Redirect Admin to Dashboard if trying to access Home
    if (to.path === '/' && authStore.user?.role === 'Admin') {
        next('/admin');
        return;
    }

    next();
});

export default router;
