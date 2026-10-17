# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Die App ist die eine Datei `index.html` (plus `server.py` als Dev-Server), kein Build, keine Tests, kein Linter. Tailwind kommt über das Play-CDN (`cdn.tailwindcss.com`). Sprache der UI und Kommentare: Deutsch.

Starten: `python3 server.py` (Port 8000; wie `http.server`, aber mit Fallback auf `index.html` für Pfade wie `/node1`). Zugriff vom Smartphone über die Rechner-IP im selben WLAN.

## Architektur

Rasterübersicht aus Nodes, Klick öffnet eine Vollbild-Detailansicht.

- **Daten:** Das Array `nodes` (Dummy-Inhalt) und `DETAILS` (Anzahl Detailkarten, für alle Nodes gleich) im Script. Raster-Kacheln und Detailkarten werden beide daraus per JS erzeugt – Inhalte nur dort ändern, nicht im HTML.
- **Kachel = verkleinerte Detailkarte 1:** `content(n, c)` liefert das Markup für beide, mit Größen in `em` (Karte: `text-base`/`sm:text-[1.25rem]`, Kachel: `font-size:5cqw` in einem `container-type:inline-size`-Button). Neue Inhalte in `content()` ergänzen, nicht getrennt in Kachel und Karte; damit sie morphen, `data-vt="…"` setzen.
- **Detailansicht:** Natives `<dialog id="detail">` ist der vertikale Scroll-Container (CSS `scroll-snap`). Jeder Node ist eine `.row` (`h-dvh`, horizontaler Snap-Container) mit `DETAILS` Karten. Vertikal = Node wechseln, horizontal = Detailkarte wechseln.
- **Spalten-Sync:** Beim Wechsel zu einem anderen Node soll dieselbe Detailkarte sichtbar bleiben. Ein Capture-`scroll`-Listener auf `#cards` setzt (debounced, 100 ms) `scrollLeft` aller anderen Rows nach. Der Punkt-Indikator (`#dots`, `setDot`) folgt dem Scrollen ohne Debounce.
- **Übergang Kachel ↔ Karte:** View Transitions API. Kachel bzw. sichtbare Karte bekommt kurz `view-transition-name: node`, ihre `[data-vt]`-Kinder `node-<vt>` (Helfer `name()`; so morphen Titel/Label/Text einzeln statt zu überblenden), `transition(dir, fn)` setzt `html[data-dir]` auf `open`/`close`. Die Eckenrundung wird im `<style>`-Block über `::view-transition-image-pair(node)` und das Keyframe `radius` animiert (Wert muss zum `rounded-2xl` der Kachel passen). Die Kachel hat bewusst keinen Schatten und nur `transition-transform`: der Übergang clippt am Radius, ein Schatten würde am Ende hineinspringen (Flackern). Ohne API-Support wird ohne Animation umgeschaltet. Esc läuft über das `cancel`-Event ebenfalls durch `go('/')`.
- **Routing:** `/<slug>#<n>` = Node mit `slug` (Feld in `nodes`), Detailkarte `n` (1-basiert); `/` = Raster. `route()` liest die URL und ist der einzige Weg, die Ansicht zu ändern: Aktionen rufen `go(url)` (pushState + `route()`), `popstate` ruft `route()`. Beim Scrollen zieht `syncUrl()` die URL per `replaceState` nach. Pfade sind absolut (App im Root).
