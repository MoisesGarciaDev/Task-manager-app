<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div v-if="loading" class="text-center">
      <span class="loading loading-dots loading-lg text-primary"></span>
      <p class="mt-4 font-bold opacity-50 uppercase tracking-widest text-xs">Loading Task...</p>
    </div>

    <div v-else-if="error" class="max-w-md w-full text-center">
      <div class="bg-base-100 p-8 rounded-2xl shadow-xl border border-error/20">
        <div class="text-error mb-4 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black uppercase italic tracking-tighter mb-2">Access Denied</h2>
        <p class="text-sm opacity-60 mb-6">{{ error }}</p>
        <router-link to="/login" class="btn btn-primary btn-outline btn-sm rounded-lg">Go to Login</router-link>
      </div>
    </div>

    <div v-else-if="task" class="max-w-2xl w-full">
      <div class="bg-base-100 rounded-3xl shadow-2xl overflow-hidden border border-base-300">
        <div class="bg-primary p-6 text-primary-content">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Shared Public Task</span>
            <div class="badge badge-outline badge-sm uppercase font-bold text-[10px] p-3">Read Only</div>
          </div>
          <h1 class="text-3xl font-black italic uppercase mt-4 leading-tight">{{ task.title }}</h1>
        </div>
        
        <div class="p-8">
            <div class="mb-5">
              <p class="text-[10px] font-bold opacity-40 uppercase tracking-widest">Task Status</p>
              <p class="font-bold text-sm" :class="task.is_completed ? 'text-success' : 'text-warning'">
                {{ task.is_completed ? '✓ Completed' : '○ Pending' }}
              </p>
          </div>

          <div class="space-y-4">
            <p class="text-[10px] font-bold opacity-40 uppercase tracking-widest">Description</p>
            <div class="bg-base-200/50 p-6 rounded-2xl italic text-sm leading-relaxed border border-base-300">
              {{ task.description || 'No description provided for this task.' }}
            </div>
          </div>

          <div class="mt-12 pt-6 border-t border-base-200 flex justify-between items-center">
            <div class="text-[10px] font-bold opacity-30 uppercase tracking-tighter">
              Created: {{ task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A' }}
            </div>
            <router-link to="/" class="btn btn-ghost btn-xs opacity-50 hover:opacity-100 font-bold uppercase tracking-widest">
              Task Manager App
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '../services/axios'; 

const route = useRoute();
const task = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const token = route.params.token;
    
    const response = await axiosInstance.get(`/tasks/public/${token}`);
    
    task.value = response.data;
  } catch (e) {
    console.error('Error fetching public task:', e);
    if (e.response?.status === 404) {
      error.value = 'Task not found or it has been set to private.';
    } else {
      error.value = 'An error occurred while trying to load the task.';
    }
  } finally {
    loading.value = false;
  }
});
</script>