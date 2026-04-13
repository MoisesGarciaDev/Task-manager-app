import { setActivePinia, createPinia } from 'pinia';
import { describe, beforeEach, it, expect } from 'vitest';
import { useTaskStore } from '../../src/store/task';

describe('TaskStore Evaluation', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('updates filter status correctly', () => {
    const store = useTaskStore();
    store.filters.status = 'completed';
    expect(store.filters.status).toBe('completed');
  });

  it('updates sort order correctly', () => {
    const store = useTaskStore();
    store.filters.sort = 'asc';
    expect(store.filters.sort).toBe('asc');
  });

  it('updates search filter correctly', () => {
    const store = useTaskStore();
    store.filters.search = 'Important task';
    expect(store.filters.search).toBe('Important task');
  });

  it('clears state on clearData completely', () => {
    const store = useTaskStore();
    
    store.tasks = [
      { id: 1, title: 'Test Task', is_private: true, share_token: 'abc' }
    ];
    store.filters.status = 'completed';
    store.filters.search = 'something';
    store.pagination = { current_page: 2, last_page: 5 };

    store.clearData();

    expect(store.tasks.length).toBe(0);
    expect(store.filters.status).toBe('all');
    expect(store.filters.search).toBe('');
    expect(store.pagination).toBeNull();
  });
});