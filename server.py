import http.server
import socketserver
import mimetypes
import os

PORT = 8081

# Ensure correct MIME types for ES modules
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

Handler = CustomHandler

print(f"Serving at http://localhost:{PORT}")
print("Press Ctrl+C to stop the server.")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
