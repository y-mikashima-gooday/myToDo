// タスクを追加する関数
async function addTask() {
    const input = document.getElementById("task-input");
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("タスクを入力してください！");
        return;
    }

    // バックエンド（Python）のAPIにタスクのデータを送信する
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskText })
    });

    // サーバー側でエラーが起きた場合の処理
    if (!response.ok) {
        console.error("サーバーエラーが発生しました");
        alert("タスクの保存に失敗しました。");
        return;
    }

    // 保存に成功したら画面のリストに追加する
    const list = document.getElementById("task-list");
    const li = document.createElement("li");

    li.innerHTML = `
        <span>${taskText}</span>
        <button onclick="finishTask(this)">完了</button>
    `;

    list.appendChild(li);
    input.value = ""; // 入力欄を空にする
}

// タスクを完了状態にする関数
function completeTask(buttonElement) {
    const li = buttonElement.parentElement;
    li.style.textDecoration = "line-through";
    li.style.color = "#888";
    buttonElement.disabled = true;
}

// すべてのタスクをクリアするイベント
document.addEventListener("DOMContentLoaded", () => {
    const clearBtn = document.getElementById("clear-button");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            document.getElementById("task-list").innerHTML = "";
        });
    }
});