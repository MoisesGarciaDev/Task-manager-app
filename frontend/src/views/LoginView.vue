<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <div class="card w-full max-w-sm shadow-2xl bg-base-100">
      <div class="card-body">
        <h2 class="text-2xl font-bold text-center mb-4">Login</h2>
        
        <div v-if="error" class="alert alert-error mb-4 py-2 shadow-sm">
          <span class="text-sm font-medium">{{ error }}</span>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-control">
            <label class="label py-0 pb-1.5 justify-start">
              <span class="label-text font-semibold text-xs opacity-70 uppercase">Email</span>
            </label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="email@example.com" 
              class="input input-bordered focus:input-primary w-full" 
              required 
              :disabled="loading"
            />
          </div>

          <div class="form-control mt-4">
            <label class="label py-0 pb-1.5 justify-start">
              <span class="label-text font-semibold text-xs opacity-70 uppercase">Password</span>
            </label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="password" 
              class="input input-bordered focus:input-primary w-full" 
              required 
              :disabled="loading"
            />
          </div>

          <div class="mt-8 flex flex-col items-center gap-4">
            <button 
              type="submit" 
              class="btn btn-primary w-full max-w-[200px]" 
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner"></span>
              Login
            </button>
            
            <div class="text-center mt-2">
              <span class="text-xs opacity-60">Don't have an account? </span>
              <router-link to="/register" class="link link-primary text-xs font-bold">
                Register here
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const error = ref(null);
const loading = ref(false);

const handleLogin = async () => {
  if (!form.value.email.trim() || !form.value.password.trim()) {
    error.value = "Please fill in all fields";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    await authStore.login({
      email: form.value.email.toLowerCase().trim(),
      password: form.value.password
    });
    router.push('/tasks');
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid credentials. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>