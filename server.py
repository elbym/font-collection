# Dev-Server: wie `python3 -m http.server`, liefert aber für unbekannte Pfade (/node1) index.html
# Serviert _site/ (Build-Ausgabe von `npm run build`).
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_site"))

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        return p if os.path.exists(p) else super().translate_path("/index.html")

ThreadingHTTPServer(("", int(os.environ.get("PORT", 8000))), Handler).serve_forever()
