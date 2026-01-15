from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

class HLSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def guess_type(self, path):
        if path.endswith(".m3u8"):
            return "application/vnd.apple.mpegurl"
        if path.endswith(".ts"):
            return "video/mp2t"
        return super().guess_type(path)

if __name__ == "__main__":
    os.chdir(os.path.dirname(__file__))
    server = HTTPServer(("0.0.0.0", 8000), HLSRequestHandler)
    print("Serving HLS with correct CORS & MIME on port 8000")
    server.serve_forever()
