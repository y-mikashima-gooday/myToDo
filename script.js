// script.js

const taskNameInput = document.getElementById('task-name');
const taskDateInput = document.getElementById('task-date');
const taskPrioInput = document.getElementById('task-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('myTodos')) || [];

function initApp() {
    console.log("Initializing App...");
    renderTodosProperly();
}

function addTask() {
    const name = taskNameInput.value.trim();
    const date = taskDateInput.value;
    const prio = taskPrioInput.value;

    if (!name) {
        alert('タスク名を入力してください');
        return;
    }

    const newTodo = {
        id: Date.now(),
        name: name,
        date: date || '期限なし',
        prio: prio,
        completed: false
    };

    todos.push(newTodo);
    saveLocal();
    renderTodosProperly();

    taskNameInput.value = '';
    taskDateInput.value = '';
    taskPrioInput.value = '2';
}

function saveLocal() {
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

function renderTodosProperly() {
    todoList.innerHTML = '';

    todos.sort((a, b) => Number(b.prio) - Number(a.prio));

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo.id;

        const prioClass =
            todo.prio === '3' ? 'prio-high' :
            todo.prio === '1' ? 'prio-low' :
            'prio-med';

        li.classList.add(prioClass);
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <div class="task-info">
                <span class="task-title">${todo.name}</span>
                <span class="task-date"><i class="far fa-calendar-alt"></i> ${todo.date}</span>
            </div>
            <div class="action-btns">
                <button class="check-btn"><i class="fas fa-check-circle"></i></button>
                <button class="trash-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        todoList.appendChild(li);
    });
}

function handleAction(e) {
    const button = e.target.closest('button');
    if (!button) return;

    const li = e.target.closest('li');
    if (!li) return;

    const id = Number(li.dataset.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    if (button.classList.contains('check-btn')) {
        todo.completed = !todo.completed;
        saveLocal();
        renderTodosProperly();
    }

    if (button.classList.contains('trash-btn')) {
        todos = todos.filter(t => t.id !== id);
        saveLocal();
        renderTodosProperly();
    }
}

if (addBtn) {
    addBtn.addEventListener('click', addTask);
} else {
    console.error("Critical Error: 'add-btn' not found in DOM.");
}

todoList.addEventListener('click', handleAction);

initApp();