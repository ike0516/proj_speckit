import { describe, it, expect, beforeEach } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { getAllTasks, addTask, updateTask, deleteTask } from '../../src/js/db.js';

beforeEach(() => {
  // Provide a fresh fake IndexedDB instance before each test
  globalThis.indexedDB = new IDBFactory();
});

describe('db.js — IndexedDB abstraction', () => {
  it('addTask() saves a task and returns it with an id', async () => {
    const task = await addTask('テストタスク');
    expect(task.id).toBeDefined();
    expect(task.title).toBe('テストタスク');
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeDefined();
  });

  it('getAllTasks() returns all stored tasks', async () => {
    await addTask('タスクA');
    await addTask('タスクB');
    const tasks = await getAllTasks();
    expect(tasks).toHaveLength(2);
    expect(tasks.map((t) => t.title)).toContain('タスクA');
    expect(tasks.map((t) => t.title)).toContain('タスクB');
  });

  it('updateTask() modifies the completed field', async () => {
    const task = await addTask('更新するタスク');
    await updateTask(task.id, { completed: true });
    const tasks = await getAllTasks();
    const updated = tasks.find((t) => t.id === task.id);
    expect(updated.completed).toBe(true);
  });

  it('deleteTask() removes the task from the store', async () => {
    const task = await addTask('削除するタスク');
    await deleteTask(task.id);
    const tasks = await getAllTasks();
    expect(tasks.find((t) => t.id === task.id)).toBeUndefined();
  });

  it('getAllTasks() returns empty array when no tasks exist', async () => {
    const tasks = await getAllTasks();
    expect(tasks).toHaveLength(0);
  });
});
