document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');

  const taskManager = new TaskManager();

  // Кнопка сброса
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Сбросить задачи';
  resetBtn.style.marginBottom = '20px';
  main.prepend(resetBtn);
  resetBtn.addEventListener('click', async () => {
    taskManager.tasks = [];
    await saveTasks();
    location.reload();
  });

  function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <h3>${task.title}</h3>
      <p class="status-text">Статус: ${task.status === 'done' ? '✅ Выполнено' : '⏳ В процессе'}</p>
      <button class="complete">✔</button>
      <button class="delete">✖</button>
    `;
    if(task.status === 'done') card.style.background = '#d4edda';
    attachEvents(card);
    return card;
  }

  function attachEvents(card) {
    const completeBtn = card.querySelector('.complete');
    const deleteBtn = card.querySelector('.delete');
    const statusText = card.querySelector('.status-text');

    completeBtn.addEventListener('click', async () => {
      const index = Array.from(main.querySelectorAll('.task-card')).indexOf(card);
      taskManager.toggleTaskStatus(index);
      const task = taskManager.getTasks()[index];
      statusText.textContent = task.status === 'done' ? 'Статус: ✅ Выполнено' : 'Статус: ⏳ В процессе';
      card.style.background = task.status === 'done' ? '#d4edda' : '';
      await saveTasks();
    });

    deleteBtn.addEventListener('click', async () => {
      const index = Array.from(main.querySelectorAll('.task-card')).indexOf(card);
      taskManager.deleteTask(index);
      card.remove();
      await saveTasks();
    });
  }

  async function saveTasks() {
    const tasks = taskManager.getTasks();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasks)
      });
    } catch(e) { console.error('Ошибка сохранения на сервере', e); }
  }

  function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if(saved) {
      const tasks = JSON.parse(saved);
      tasks.forEach(taskData => {
        const task = new Task(taskData.title, taskData.status);
        taskManager.tasks.push(task);
        const card = createTaskCard(task);
        main.appendChild(card);
      });
    }
  }

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if(!title) return;
    const task = taskManager.addTask(title);
    const card = createTaskCard(task);
    main.appendChild(card);
    await saveTasks();
    taskInput.value = '';
    taskInput.focus();
  });

  loadTasks();
});