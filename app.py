from flask import Flask, request, jsonify, send_from_directory

# 同じフォルダ内のHTML/CSS/JSを読み込むための設定
app = Flask(__name__, static_folder='.')

# 疑似データベース（タスクを保存するリスト）
tasks = []

# トップページ（index.html）を表示するルート
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# CSSやJSなどの静的ファイルを返すルート
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# タスクを追加するAPIエンドポイント
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    
    # 受け取ったデータをタスクリストに追加
    tasks.add(data)
    
    return jsonify({"message": "タスクを追加しました", "tasks": tasks})

if __name__ == '__main__':
    print("サーバーを起動します。ブラウザで http://localhost:8000 にアクセスしてください。")
    app.run(port=8000, debug=True)