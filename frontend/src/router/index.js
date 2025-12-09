import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SignIn from '../views/auth/SignIn.vue';
import SignUp from '../views/auth/SignUp.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'SignIn',
        component: SignIn
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
