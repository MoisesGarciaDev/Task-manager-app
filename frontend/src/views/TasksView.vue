<template>
  <div class="toast toast-end toast-bottom z-[100]">
    <div v-if="showToast" class="alert shadow-lg border-none rounded-lg" :class="toastClass">
      <span class="font-bold text-sm text-white">{{ toastMessage }}</span>
    </div>
  </div>

  <div class="min-h-screen bg-base-200 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 class="text-4xl font-black text-primary tracking-tight italic uppercase">My Tasks</h1>
          <p class="mt-1 text-[10px] opacity-50 font-bold uppercase tracking-widest">Personal Productivity Dashboard</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="add_task_modal.showModal()" class="btn btn-primary shadow-lg gap-2 rounded-lg" :disabled="anyLoading">
            <Plus :size="20" /> New Task
          </button>
          
          <div v-if="loggingOut" class="fixed inset-0 z-[200] bg-base-300/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="font-black text-primary uppercase tracking-widest animate-pulse">Closing Session...</p>
          </div>
          <router-link to="/profile" class="btn btn-ghost gap-2 rounded-lg">
            <User :size="18" /> <span class="hidden sm:inline">Profile</span>
          </router-link>
          <button @click="logout" class="btn btn-ghost text-error gap-2 rounded-lg" :disabled="anyLoading || loggingOut">
            <span v-if="loggingOut" class="loading loading-spinner loading-xs"></span>
            <LogOut v-else :size="18" /> 
            <span class="hidden sm:inline">{{ loggingOut ? 'Exiting...' : 'Logout' }}</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300">
        <div class="join shadow-sm border border-base-300">
          <button @click="setFilter('all')" :class="['join-item btn btn-sm px-6', taskStore.filters.status === 'all' ? 'btn-active btn-primary' : '']" :disabled="anyLoading">All</button>
          <button @click="setFilter('pending')" :class="['join-item btn btn-sm px-6', taskStore.filters.status === 'pending' ? 'btn-active btn-primary' : '']" :disabled="anyLoading">Pending</button>
          <button @click="setFilter('completed')" :class="['join-item btn btn-sm px-6', taskStore.filters.status === 'completed' ? 'btn-active btn-primary' : '']" :disabled="anyLoading">Completed</button>
        </div>

        <div class="flex flex-col md:flex-row items-center gap-3 w-full md:flex-1 md:justify-end">
          <div class="relative w-full md:max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Search class="text-primary opacity-70" :size="18" />
            </div>
            <input 
              v-model="taskStore.filters.search" 
              @input="debounceSearch"
              type="text" 
              maxlength="50"
              placeholder="Search tasks..." 
              class="input input-bordered input-sm w-full pl-10 focus:input-primary rounded-lg"
              :disabled="anyLoading"
            />
          </div>
          <select v-model="taskStore.filters.sort" class="select select-bordered select-sm w-full md:w-auto font-medium rounded-lg" @change="taskStore.fetchTasks(1)" :disabled="anyLoading">
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>

      <div class="relative min-h-[400px]">
        <div v-if="taskStore.loading" class="absolute inset-0 z-20 bg-base-200/50 flex justify-center items-start pt-20 backdrop-blur-[1px]">
          <span class="loading loading-dots loading-lg text-primary"></span>
        </div>

        <div v-if="!taskStore.loading && taskStore.tasks.length === 0" class="text-center py-20 opacity-40 italic font-medium">
          No tasks found.
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" :class="{'opacity-50 pointer-events-none': taskStore.loading || anyLoading}">
          <div v-for="task in taskStore.tasks" :key="task.id" class="card bg-base-100 shadow-sm border border-base-300 rounded-xl overflow-hidden transition-all">
            <div class="card-body p-6 flex flex-col">
              
              <div class="flex justify-between items-start mb-4">
                <input 
                  type="checkbox" 
                  :checked="task.is_completed" 
                  @change="handleStatusChange(task)"
                  class="checkbox checkbox-primary rounded-md" 
                  :disabled="anyLoading"
                />
                <div class="flex gap-1">
                  <button v-if="editingId !== task.id" @click="startEdit(task)" class="btn btn-ghost btn-xs btn-square opacity-50 hover:opacity-100" :disabled="anyLoading">
                    <Pencil :size="14" />
                  </button>
                  <button @click="deleteTask(task.id)" class="btn btn-ghost btn-xs btn-square text-error opacity-50 hover:opacity-100" :disabled="anyLoading">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>

              <div class="w-full flex-grow min-h-[120px]">
                <form v-if="editingId === task.id" @submit.prevent="handleUpdate(task)" class="flex flex-col gap-4 w-full">
                  <input v-model="editingTitle" required minlength="3" maxlength="100" class="input input-sm input-bordered w-full font-bold rounded-md" />
                  <textarea v-model="editingDescription" maxlength="500" class="textarea textarea-bordered w-full h-24 text-xs resize-none rounded-md"></textarea>
                  <div class="flex justify-end gap-2 mt-2">
                    <button type="submit" :disabled="anyLoading" class="btn btn-xs btn-success text-white px-4 rounded-md">Save</button>
                    <button type="button" @click="cancelEdit" class="btn btn-xs btn-ghost px-4 rounded-md" :disabled="anyLoading">Cancel</button>
                  </div>
                </form>

                <div v-else class="w-full">
                  <h3 :class="{'line-through opacity-40 italic': task.is_completed}" class="font-bold text-lg leading-tight break-words">
                    {{ task.title }}
                  </h3>
                  <p class="text-xs opacity-60 mt-4 whitespace-pre-wrap break-words border-l-2 border-primary/20 pl-3 italic">
                    {{ task.description || 'No description provided.' }}
                  </p>
                </div>
              </div>

              <div class="card-actions justify-between items-center mt-6 pt-4 border-t border-base-200">
                <div class="flex items-center gap-1 opacity-40 text-[10px] font-bold uppercase tracking-tighter">
                  <Calendar :size="10" />
                  {{ new Date(task.created_at).toLocaleDateString() }}
                </div>
                <div class="flex gap-1">
                  <button @click="togglePrivacy(task)" :disabled="anyLoading" class="btn btn-xs btn-ghost gap-1 px-2 text-[10px] font-bold uppercase tracking-tighter rounded-md">
                    <template v-if="!(anyLoading && loadingTaskId === task.id)">
                      <Lock v-if="task.is_private" :size="10" />
                      <Globe v-else :size="10" />
                    </template>
                    {{ task.is_private ? 'Private' : 'Public' }}
                  </button>
                  <button v-if="!task.is_private" @click="copyShareLink(task)" :disabled="anyLoading || copiedId === task.id" class="btn btn-xs btn-info px-2 gap-1 text-[10px] font-bold uppercase tracking-tighter rounded-md">
                    <Share2 v-if="copiedId !== task.id" :size="10" />
                    {{ copiedId === task.id ? 'Copied!' : 'Share' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="taskStore.pagination && taskStore.pagination.last_page > 1" class="flex flex-col items-center mt-16 gap-4">
          <div class="join border border-base-300 bg-base-100 shadow-sm rounded-lg overflow-hidden">
            <button @click="taskStore.fetchTasks(taskStore.pagination.current_page - 1)" :disabled="taskStore.pagination.current_page === 1 || anyLoading" class="join-item btn btn-sm px-4">«</button>
            <button class="join-item btn btn-sm no-animation pointer-events-none">{{ taskStore.pagination.current_page }} / {{ taskStore.pagination.last_page }}</button>
            <button @click="taskStore.fetchTasks(taskStore.pagination.current_page + 1)" :disabled="taskStore.pagination.current_page === taskStore.pagination.last_page || anyLoading" class="join-item btn btn-sm px-4">»</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <dialog id="add_task_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box border-t-4 border-primary rounded-2xl p-8">
      <h3 class="font-black text-3xl text-primary italic uppercase tracking-tighter mb-6">New Task</h3>
      <form @submit.prevent="handleAddTaskAndClose">
        <div class="flex flex-col gap-5">
          <input v-model="newTaskTitle" type="text" required minlength="3" maxlength="100" placeholder="Task title" class="input input-bordered w-full focus:input-primary rounded-lg text-sm bg-base-200/50" />
          <textarea v-model="newTaskDescription" maxlength="500" placeholder="Description (optional)" class="textarea textarea-bordered h-32 resize-none focus:input-primary rounded-lg text-sm bg-base-200/50"></textarea>
        </div>
        <div class="modal-action mt-8 flex gap-2">
          <button type="button" @click="closeAddTaskModal" class="btn btn-ghost px-6 rounded-lg font-bold text-xs" :disabled="anyLoading">Cancel</button>
          <button type="submit" class="btn btn-primary px-10 rounded-lg font-bold text-xs uppercase shadow-lg" :disabled="anyLoading || !newTaskTitle.trim()">
            {{ adding ? 'Saving...' : 'Save Task' }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTaskStore } from '../store/task';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { Plus, Pencil, Trash2, Share2, Lock, Globe, LogOut, Search, Calendar, User } from 'lucide-vue-next';

const taskStore = useTaskStore();
const authStore = useAuthStore();
const router = useRouter();

const newTaskTitle = ref('');
const newTaskDescription = ref(''); 
const adding = ref(false);
const globalActionLoading = ref(false);
const loadingTaskId = ref(null);
const editingId = ref(null);
const editingTitle = ref('');
const editingDescription = ref(''); 
const copiedId = ref(null);
const loggingOut = ref(false);

const showToast = ref(false);
const toastMessage = ref('');
const toastClass = ref('alert-success');
let searchTimeout = null;

const anyLoading = computed(() => globalActionLoading.value || adding.value);

onMounted(async () => {
  taskStore.clearData();
  taskStore.filters.status = 'all'; 
  await taskStore.fetchTasks();
});

const triggerToast = (message, type = 'success') => {
  toastMessage.value = message;
  toastClass.value = type === 'success' ? 'alert-success' : 'alert-error';
  showToast.value = true;
  setTimeout(() => { showToast.value = false; }, 3000);
};

const closeAddTaskModal = () => {
  document.getElementById('add_task_modal').close();
  newTaskTitle.value = '';
  newTaskDescription.value = '';
};

const handleAddTaskAndClose = async () => {
  if (!newTaskTitle.value.trim()) return;
  adding.value = true; 
  try {
    await taskStore.addTask({ 
      title: newTaskTitle.value.trim(), 
      description: newTaskDescription.value.trim(),
      is_completed: false,
      is_private: true 
    });
    closeAddTaskModal();
    triggerToast('Task created successfully!');
  } catch (e) {
    triggerToast('Error saving task', 'error');
  } finally {
    adding.value = false; 
  }
};

const handleStatusChange = async (task) => {
  if (anyLoading.value) return;
  globalActionLoading.value = true;
  loadingTaskId.value = task.id;
  try {
    await taskStore.updateTask(task.id, { is_completed: !task.is_completed });
  } catch (e) {
    triggerToast('Error updating status', 'error');
  } finally {
    globalActionLoading.value = false;
    loadingTaskId.value = null;
  }
};

const togglePrivacy = async (task) => {
  if (anyLoading.value) return;
  globalActionLoading.value = true;
  loadingTaskId.value = task.id;
  
  const nextPrivacyState = !task.is_private;
  
  try {
    await taskStore.updateTask(task.id, { is_private: nextPrivacyState });
    triggerToast(nextPrivacyState ? 'Task is now Private' : 'Task is now Public');
  } catch (e) {
    triggerToast('Error updating privacy', 'error');
  } finally {
    globalActionLoading.value = false;
    loadingTaskId.value = null;
  }
};

const startEdit = (task) => {
  if (anyLoading.value) return;
  editingId.value = task.id;
  editingTitle.value = task.title;
  editingDescription.value = task.description || '';
};

const cancelEdit = () => { editingId.value = null; };

const handleUpdate = async (task) => {
  if (!editingTitle.value.trim()) return;
  globalActionLoading.value = true;
  loadingTaskId.value = task.id;
  try {
    await taskStore.updateTask(task.id, { 
      title: editingTitle.value.trim(),
      description: editingDescription.value.trim() 
    });
    editingId.value = null;
    triggerToast('Updated successfully');
  } catch (e) {
    triggerToast('Update failed', 'error');
  } finally {
    globalActionLoading.value = false;
    loadingTaskId.value = null;
  }
};

const deleteTask = async (id) => {
  if (anyLoading.value || !confirm('Delete this task?')) return;
  globalActionLoading.value = true;
  try {
    await taskStore.deleteTask(id);
    triggerToast('Task deleted', 'success');
  } catch (e) {
    triggerToast('Delete failed', 'error');
  } finally {
    globalActionLoading.value = false;
  }
};

const setFilter = (status) => {
  taskStore.filters.status = status;
  taskStore.fetchTasks(1);
};

const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => { taskStore.fetchTasks(1); }, 400);
};

const copyShareLink = (task) => {
  if (anyLoading.value || copiedId.value === task.id) return;
  const url = `${window.location.origin}/public/task/${task.share_token}`;
  navigator.clipboard.writeText(url);
  copiedId.value = task.id;
  triggerToast('Public link copied!');
  setTimeout(() => { copiedId.value = null; }, 2000);
};

const logout = async () => {
  if (loggingOut.value) return;
  loggingOut.value = true;
  try {
    taskStore.clearData(); 
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    loggingOut.value = false;
  }
};
</script>