# Nodes

Einfache Web-App: Rasterübersicht aus Nodes, Klick öffnet eine Vollbild-Detailansicht mit einrastenden Karten.

- Vertikal scrollen: nächster/vorheriger Node
- Horizontal scrollen: weitere Detailkarten des Nodes (Punkte unten zeigen die aktuelle)
- × oder Esc schließt die Detailansicht

## Ausprobieren

`python3 server.py` im Projektordner starten und `localhost:8000` aufrufen. (Ein einfacher `http.server` genügt nicht, weil Adressen wie `/node1` auf `index.html` zurückfallen müssen.)

Tailwind wird über das CDN geladen (nur zum Testen gedacht). Inhalte stehen als Dummy-Daten im Array `nodes` in `index.html`.

## Adressen

- `/` – Raster
- `/node1` – Detailansicht von Node 1
- `/node1#3` – Node 1, Detailkarte 3
