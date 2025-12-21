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
        path: '/customer',
        children: [
            {
                path: '',
                name: 'Home',
                component: Home
            }
        ]
    },
    {
        path: '/',
        redirect: to => {
            const authStore = useAuthStore();
            if (authStore.user?.role === 'Admin') {
                return '/admin';
            }
            return '/customer';
        }
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
            next('/customer'); // Redirect unauthorized access to customer home
            return;
        }
    }

    // Prevent Admin from accessing customer routes if you want strict separation?
    // User only asked for "admin skips home".
    // If admin visits /customer, should they be kicked to /admin?
    // "go staight forward to his admin dashboard, he does not neeed the home page"
    if (to.path.startsWith('/customer') && authStore.user?.role === 'Admin') {
        next('/admin');
        return;
    }

    next();
});

export default router;
