import { defineStore } from 'pinia';
import axios from '../services/axios';
import { useTaskStore } from './task';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async register(userData) {
            try {
                const response = await axios.post('/register', userData);
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('token', this.token);
                return response;
            } catch (error) {
                throw error;
            }
        },
        async login(credentials) {
            try {
                const response = await axios.post('/login', credentials);
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('token', this.token);
                return response;
            } catch (error) {
                throw error;
            }
        },
        async logout() {
            try {
                await axios.post('/logout');
            } finally {
                const taskStore = useTaskStore();
                taskStore.clearData();

                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            }
        },
        async fetchUser() {
            if (!this.token) return;
            try {
                const response = await axios.get('/user');
                this.user = response.data;
            } catch (error) {
                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
                throw error;
            }
        }
    }
});