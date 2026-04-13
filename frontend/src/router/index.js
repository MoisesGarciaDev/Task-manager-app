import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/RegisterView.vue'),
        meta: { guest: true }
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: () => import('../views/TasksView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/public/task/:token',
        name: 'public.task',
        component: () => import('../views/PublicTaskView.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/tasks'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    if (auth.token && !auth.user) {
        try {
            await auth.fetchUser();
        } catch (error) {    
            return next('/login');
        }
    }

    const isAuthenticated = !!auth.token;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.meta.guest && isAuthenticated) {
        next('/tasks');
    } else {
        next();
    }
});

export default router;