<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
      <div class="card-body p-8">
        
        <div class="text-center mb-10">
          <h1 class="text-3xl font-black text-primary italic uppercase tracking-tighter">Join Us</h1>
          <p class="text-[10px] opacity-50 font-bold uppercase tracking-widest mt-1">Create your account</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div class="form-control w-full">
            <label class="label pb-1.5 justify-start">
              <span class="label-text font-bold text-xs opacity-70 uppercase tracking-wide">Name</span>
            </label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              minlength="3"
              placeholder="Your name" 
              class="input input-bordered focus:input-primary w-full bg-base-200/50 rounded-lg text-sm" 
            />
          </div>

          <div class="form-control w-full">
            <label class="label pb-1.5 justify-start">
              <span class="label-text font-bold text-xs opacity-70 uppercase tracking-wide">Email</span>
            </label>
            <input 
              v-model="form.email" 
              type="email" 
              required
              placeholder="email@example.com" 
              class="input input-bordered focus:input-primary w-full bg-base-200/50 rounded-lg text-sm" 
            />
          </div>

          <div class="form-control w-full">
            <label class="label pb-1.5 justify-start">
              <span class="label-text font-bold text-xs opacity-70 uppercase tracking-wide">Password</span>
            </label>
            <input 
              v-model="form.password" 
              type="password" 
              required
              minlength="8"
              placeholder="Min 8 characters" 
              class="input input-bordered focus:input-primary w-full bg-base-200/50 rounded-lg text-sm" 
            />
          </div>

          <div class="form-control w-full">
            <label class="label pb-1.5 justify-start">
              <span class="label-text font-bold text-xs opacity-70 uppercase tracking-wide">Confirm Password</span>
            </label>
            <input 
              v-model="form.password_confirmation" 
              type="password" 
              required
              placeholder="Repeat password" 
              class="input input-bordered focus:input-primary w-full bg-base-200/50 rounded-lg text-sm" 
            />
          </div>

          <div class="pt-6 flex flex-col items-center gap-5">
            <button type="submit" class="btn btn-primary w-full shadow-lg rounded-lg uppercase font-bold text-sm" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              Register
            </button>

            <div class="divider text-[10px] opacity-30 font-bold uppercase">OR</div>

            <router-link to="/login" class="link link-primary text-xs font-bold no-underline hover:underline">
              Already have an account? Login
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <div class="toast toast-end toast-bottom z-[100]">
      <div v-if="errorMsg" class="alert shadow-lg rounded-lg" :class="isWarning ? 'alert-warning' : 'alert-error'">
        <span class="text-sm font-bold">{{ errorMsg }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const errorMsg = ref('');
const isWarning = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const validateJS = () => {
  if (!form.name.trim() || !form.email.trim()) {
    return "All fields are required";
  }
  if (form.password !== form.password_confirmation) {
    return "Passwords do not match";
  }
  if (form.password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
};

const handleRegister = async () => {
  if (loading.value) return;

  const clientError = validateJS();
  if (clientError) {
    isWarning.value = true;
    errorMsg.value = clientError;
    setTimeout(() => { errorMsg.value = ''; }, 3000);
    return;
  }

  loading.value = true;
  errorMsg.value = '';
  isWarning.value = false;

  try {
    await authStore.register({
      ...form,
      name: form.name.trim(),
      email: form.email.toLowerCase().trim()
    });
    router.push('/tasks');
  } catch (e) {
    const serverErrors = e.response?.data?.errors;
    if (serverErrors) {
      errorMsg.value = Object.values(serverErrors)[0][0];
    } else {
      errorMsg.value = e.response?.data?.message || 'Registration failed';
    }
    setTimeout(() => { errorMsg.value = ''; }, 5000);
  } finally {
    loading.value = false;
  }
};
</script>