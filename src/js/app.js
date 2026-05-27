import { getAllTasks, addTask, updateTask, deleteTask } from './db.js';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const errorMsg = document.getElementById('error-msg');
const taskList = document.getElementById('task-list');

async function renderTaskList() {
  const tasks = await getAllTasks();
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'タスクがありません';
    taskList.appendChild(empty);
    return;
  }

  for (const task of tasks) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;
    checkbox.addEventListener('change', async () => {
      await updateTask(task.id, { completed: checkbox.checked });
      await renderTaskList();
    });

    const label = document.createElement('label');
    label.htmlFor = `task-${task.id}`;
    label.textContent = task.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', async () => {
      await deleteTask(task.id);
      await renderTaskList();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();

  if (!title) {
    input.classList.add('error');
    errorMsg.hidden = false;
    input.focus();
    return;
  }

  input.classList.remove('error');
  errorMsg.hidden = true;

  await addTask(title);
  input.value = '';
  input.focus();
  await renderTaskList();
});

input.addEventListener('input', () => {
  if (input.value.trim()) {
    input.classList.remove('error');
    errorMsg.hidden = true;
  }
});

document.addEventListener('DOMContentLoaded', renderTaskList);
