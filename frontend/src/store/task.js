import { defineStore } from 'pinia';
import axios from '../services/axios'; 

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [],
        pagination: null,
        loading: false,
        filters: {
            status: 'all',
            search: '',
            sort: 'desc'
        }
    }),

    actions: {
        async fetchTasks(page = 1) {
            this.loading = true;
            try {
                const params = {
                    page: page,
                    search: this.filters.search || null
                };

                if (this.filters.status === 'completed') {
                    params.is_completed = 1;
                } else if (this.filters.status === 'pending') {
                    params.is_completed = 0;
                }
                
                const response = await axios.get('/tasks', { params });
                
                this.tasks = response.data.data;
                this.pagination = response.data.meta;
            } catch (error) {
                console.error("Error al cargar tareas:", error);
            } finally {
                this.loading = false;
            }
        },

        async addTask(taskData) {
            await axios.post('/tasks', taskData);
            await this.fetchTasks(1);
        },

        async updateTask(id, updates) {
            await axios.put(`/tasks/${id}`, updates);
            await this.fetchTasks(this.pagination?.current_page || 1);
        },

        async deleteTask(id) {
            await axios.delete(`/tasks/${id}`);
            await this.fetchTasks(1);
        },
         clearData() {
                this.tasks = [];
                this.pagination = null;
                this.loading = false;
                this.filters = {
                    status: 'all',
                    search: '',
                    sort: 'desc'
            };
        }
    }
});