const path = require('path');
const fs = require('fs/promises');
const express = require('express');
const app = express();

// Настройка Pug
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());

// Путь к файлу с задачами
const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json');

// =========================
// Функции чтения и записи
// =========================
async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения tasks.json:', error);
    return [];
  }
}

async function writeTasks(tasks) {
  try {
    await fs.writeFile(
      TASKS_FILE,
      JSON.stringify(tasks, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Ошибка записи tasks.json:', error);
  }
}

// =========================
// Маршруты
// =========================

// Главная
app.get('/', async (req, res) => {
  const tasks = await readTasks();
  res.render('pages/index', { tasks });
});

// Архив
app.get('/archive', async (req, res) => {
  const tasks = await readTasks();
  const completedTasks = tasks.filter(task => task.status === 'done');
  res.render('pages/archive', { tasks: completedTasks });
});

// Настройки
app.get('/settings', (req, res) => {
  res.render('pages/settings');
});

// О приложении
app.get('/about', (req, res) => {
  res.render('pages/about');
});

// API для сохранения задач
app.post('/api/tasks', async (req, res) => {
  try {
    const tasks = req.body;
    await writeTasks(tasks);
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка сохранения задач:', error);
    res.status(500).json({ success: false, message: 'Ошибка сохранения задач' });
  }
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});