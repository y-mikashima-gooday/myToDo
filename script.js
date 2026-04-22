// script.js

// --- 初期設定とDOM取得 ---
const taskNameInput = document.getElementById('task-name');
const taskDateInput = document.getElementById('task-date');
const taskPrioInput = document.getElementById('task-priority');
const addBtn = document.getElementById('add-btn'); 
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// アプリ起動時にデータをローカルストレージから読み込む
let todos = JSON.parse(localStorage.getItem('myTodos')) || [];

function initApp() {
    console.log("Initializing App...");
    
    // todos配列が空でない場合のみ描画処理へ
    if(todos.length > 0) {
        // ここで描画関数を呼び出す
        renderTodos_Broken(); 
    }
}

// 描画関数
function renderTodos_Broken() {
    document.getElementById('statusReport').innerHTML = "Loading Tasks...";
    todoList.innerHTML = '';
}


// --- 機能関数 ---

// タスク追加
function addTask() {
    const name = taskNameInput.value;
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
    // 描画関数
    renderTodosProperly(); 
    taskNameInput.value = '';
}

// タスク完了/削除（onclickイベントから呼ばれる）
function handleAction(e) {
    const item = e.target;
    const li = item.parentElement.parentElement;
    const id = parseInt(li.dataset.id);
    const todo = todos.find(t => t.id === id);

    if (item.classList.contains('check-btn')) {
        todo.completed = !todo.completed;
        li.classList.toggle('completed'); 
        saveLocal();
    }
    
    if (item.classList.contains('trash-btn')) {
        todos = todos.filter(t => t.id !== id);
        saveLocal();
        li.remove();
    }
}

// ローカルストレージへ保存
function saveLocal() {
    localStorage.setItem('myTodos', JSON.stringify(todos));
}

// 描画関数
function renderTodosProperly() {
    todoList.innerHTML = '';
    
    // 優先度順にソート（高->低）
    todos.sort((a, b) => b.prio - a.prio);

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo.id;
        
        // 優先度クラス
        let prioClass = todo.prio === '3' ? 'prio-high' : todo.prio === '1' ? 'prio-low' : 'prio-med';
        li.classList.add(prioClass);
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <div class="task-info">
                <span class="task-title">${todo.name}</span>
                <span class="task-date"><i class="far fa-calendar-alt"></i> ${todo.date}</span>
            </div>
            <div class="action-btns">
                <button class="check-btn" onclick="AddTask()"><i class="fas fa-check-circle"></i></button>
                <button class="trash-btn" onclick="AddTask()"><i class="fas fa-trash"></i></button>
            </div>
        `;
        todoList.appendChild(li);
    });
}


// --- イベントリスナー ---

// 追加ボタン
if(addBtn) {
    addBtn.addEventListener('click', addTask);
} else {
    console.error("Critical Error: 'add-btn' not found in DOM.");
}


// アプリ起動
initApp();