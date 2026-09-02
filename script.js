// script.js

const taskNameInput = document.getElementById('task-name');
const taskDateInput = document.getElementById('task-date');
const taskTimeInput = document.getElementById('task-time');
const taskPrioInput = document.getElementById('task-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

let todos = JSON.parse(localStorage.getItem('myTodos')) || [];
let currentFilter = 'all';

function initApp() {
    setupEventListeners();
    renderTodosProperly();
}

function setupEventListeners() {
    if (addBtn) addBtn.addEventListener('click', addTask);
    todoList.addEventListener('click', handleAction);
    if (searchInput) searchInput.addEventListener('input', renderTodosProperly);
    if (sortSelect) sortSelect.addEventListener('change', renderTodosProperly);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodosProperly();
        });
    });
}

function addTask() {
    const name = taskNameInput.value.trim();
    const dateVal = taskDateInput.value; // YYYY-MM-DD
    const timeVal = taskTimeInput.value; // HH:MM (省略時は空文字)
    const prio = taskPrioInput.value;

    if (!name) {
        alert('タスク名を入力してください');
        return;
    }

    const newTodo = {
        id: Date.now(),
        name: name,
        date: dateVal || null,
        time: timeVal || null,
        prio: prio,
        completed: false
    };

    todos.push(newTodo);
    saveLocal();
    renderTodosProperly();

    taskNameInput.value = '';
    taskDateInput.value = '';
    taskTimeInput.value = '';
    taskPrioInput.value = '2';
}

function saveLocal() {
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

function renderTodosProperly() {
    todoList.innerHTML = '';
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const sortType = sortSelect ? sortSelect.value : 'prio-desc';
    const now = new Date();

    let filteredTodos = [...todos];

    // 1. ステータスフィルター
    if (currentFilter === 'active') {
        filteredTodos = filteredTodos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = filteredTodos.filter(t => t.completed);
    }

    // 2. 検索絞り込み
    if (searchTerm) {
        filteredTodos = filteredTodos.filter(t => t.name.toLowerCase().includes(searchTerm));
    }

    // 3. ソート（日付順 / 優先度順）
    filteredTodos.sort((a, b) => {
        if (sortType === 'date-asc') {
            if (!a.date) return 1;
            if (!b.date) return -1;
            
            const aStr = `${a.date}T${a.time || '23:59'}`;
            const bStr = `${b.date}T${b.time || '23:59'}`;
            return new Date(aStr) - new Date(bStr);
        } else {
            return Number(b.prio) - Number(a.prio);
        }
    });

    // 4. DOM描写
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo.id;

        const prioClass =
            todo.prio === '3' ? 'prio-high' :
            todo.prio === '1' ? 'prio-low' : 'prio-med';
        li.classList.add(prioClass);

        // 期限切れ判定（未完了かつ指定日時を過ぎているか）
        let isExpired = false;
        if (todo.date && !todo.completed) {
            // 時間が省略された場合は「その日の 23:59:59」を締め切りとする
            const timeString = todo.time ? `${todo.time}:00` : '23:59:59';
            const taskDeadline = new Date(`${todo.date}T${timeString}`);
            if (now > taskDeadline) {
                isExpired = true;
            }
        }

        if (isExpired) li.classList.add('expired');
        if (todo.completed) li.classList.add('completed');

        // 表示用の日付フォーマット
        let displayDate = '期限なし';
        if (todo.date) {
            const formattedDate = todo.date.replace(/-/g, '/');
            displayDate = todo.time ? `${formattedDate} ${todo.time}` : formattedDate;
        }

        li.innerHTML = `
            <div class="task-content">
                <span class="task-title">
                    ${isExpired ? '<span class="expired-badge">⚠️ 期限切れ</span>' : ''}
                    ${todo.name}
                </span>
                <span class="task-date"><i class="far fa-calendar-alt"></i> ${displayDate}</span>
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

initApp();