# Dev-Server: wie `python3 -m http.server`, liefert aber für unbekannte Pfade (/node1) index.html
# Serviert _site/ (Build-Ausgabe von `npm run build`).
# Optional: `python3 server.py --prefix /font-collection` serviert _site unter diesem Pfad (wie GitHub Pages).
import argparse
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

ap = argparse.ArgumentParser()
ap.add_argument("--prefix", default="", help="Pfad-Präfix, z. B. /font-collection")
PREFIX = ap.parse_args().prefix.rstrip("/")
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_site"))

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = urlsplit(path).path
        if PREFIX:
            if path == PREFIX:
                path = "/"
            if path.startswith(PREFIX + "/"):
                path = path[len(PREFIX):]
        p = super().translate_path(path)
        return p if os.path.exists(p) else super().translate_path("/index.html")

ThreadingHTTPServer(("", int(os.environ.get("PORT", 8000))), Handler).serve_forever()
