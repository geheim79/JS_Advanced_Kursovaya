// Класс одной задачи
class Task {
  constructor(title, status = 'in-progress') {
    this.title = title;
    this.status = status;
  }

  // Переключение статуса
  toggleStatus() {
    if (this.status === 'done') {
      this.status = 'in-progress';
    } else {
      this.status = 'done';
    }
  }
}

// Класс для управления списком задач
class TaskManager {
  constructor() {
    this.tasks = [];
  }

  // Добавить задачу
  addTask(title) {
    const task = new Task(title);
    this.tasks.push(task);
    return task;
  }

  // Удалить задачу по индексу
  deleteTask(index) {
    this.tasks.splice(index, 1);
  }

  // Переключить статус задачи
  toggleTaskStatus(index) {
    this.tasks[index].toggleStatus();
  }

  // Получить массив задач
  getTasks() {
    return this.tasks;
  }
}