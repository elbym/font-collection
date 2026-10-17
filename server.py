# Dev-Server: wie `python3 -m http.server`, liefert aber für unbekannte Pfade (/node1) index.html
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        return p if os.path.exists(p) else super().translate_path("/index.html")

ThreadingHTTPServer(("", 8000), Handler).serve_forever()
