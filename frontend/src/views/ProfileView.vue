<template>
  <div class="min-h-screen bg-base-200 p-4 md:p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-black text-primary italic uppercase tracking-tighter mb-8">User Profile</h1>
      <router-link to="/tasks" class="btn btn-ghost btn-sm gap-2">
      <ArrowLeft :size="16" /> Back to Tasks
    </router-link>
      <div class="card bg-base-100 shadow-xl border border-base-300">
        <div class="card-body gap-6">
          <form @submit.prevent="updateProfile" class="space-y-4">
            <h2 class="text-sm font-black uppercase opacity-40">Personal Information</h2>
            <label class="label"><span class="label-text font-bold text-xs uppercase">Full Name</span></label>
            <div class="form-control">
              <input v-model="form.name" type="text" required minlength="3" class="input input-bordered focus:input-primary bg-base-200/50" />
            </div>
            <label class="label"><span class="label-text font-bold text-xs uppercase">Email</span></label>
            <div class="form-control">
              <input :value="authStore.user?.email" type="email" disabled class="input input-bordered opacity-50 cursor-not-allowed" />
            </div>
            <button type="submit" class="btn btn-primary btn-sm w-full md:w-auto px-8" :disabled="loading">
              {{ loading ? 'Updating...' : 'Update Name' }}
            </button>
          </form>

          <div class="divider"></div>

          <form @submit.prevent="updatePassword" class="space-y-4">
            <h2 class="text-sm font-black uppercase opacity-40">Change Password</h2>
            <div class="form-control">
              <input v-model="passForm.current_password" type="password" placeholder="Current Password" required class="input input-bordered focus:input-primary bg-base-200/50" />
            </div>
            <div class="form-control">
              <input v-model="passForm.new_password" type="password" placeholder="New Password (min 8 chars)" required minlength="8" class="input input-bordered focus:input-primary bg-base-200/50" />
            </div>
            <div class="form-control">
              <input v-model="passForm.password_confirmation" type="password" placeholder="Confirm New Password" required class="input input-bordered focus:input-primary bg-base-200/50" />
            </div>
            <button type="submit" class="btn btn-outline btn-primary btn-sm w-full md:w-auto px-8" :disabled="loading">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../store/auth';
import axios from '../services/axios';

const authStore = useAuthStore();
const loading = ref(false);

const form = reactive({ name: authStore.user?.name || '' });
const passForm = reactive({ current_password: '', new_password: '', password_confirmation: '' });

const updateProfile = async () => {
  loading.value = true;
  try {
    const res = await axios.put('/user/profile-information', form);
    authStore.user.name = form.name;
    alert('Name updated');
  } catch (e) {
    alert('Error updating name');
  } finally { loading.value = false; }
};

const updatePassword = async () => {
  if (passForm.new_password !== passForm.password_confirmation) {
    alert('Passwords do not match in frontend');
    return;
  }
  
  loading.value = true;
  try {
    await axios.put('/user/password', {
      current_password: passForm.current_password,
      new_password: passForm.new_password,
      new_password_confirmation: passForm.password_confirmation 
    });
    
    passForm.current_password = '';
    passForm.new_password = '';
    passForm.password_confirmation = '';
    alert('Password updated successfully');
  } catch (e) {
    alert(e.response?.data?.message || 'Error updating password');
  } finally {
    loading.value = false;
  }
};
</script>