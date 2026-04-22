# app.py
from http.server import SimpleHTTPRequestHandler
import socketserver

PORT = 8000

print(f"--- ToDo App Server booting on port {PORT} ---")


class MyHandler(SimpleHTTPRequestHandler) {
    def do_GET(self):
        print(f"Request received: {self.path}")
        super().do_GET()
}

  with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Server is running at http://localhost:{PORT}")
    httpd.serve_forever()