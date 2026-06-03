# Inaka: Die drei Siegel

Eigenstaendiger MVP-Prototyp fuer ein Top-Down-Action-Adventure im 16-Bit-Stil. Das Spiel rendert komplett ueber ein HTML5-Canvas und nutzt eine manuell editierbare Tile-Matrix als Weltgrundlage.

## Start

- Datei direkt oeffnen: `InakaAdv/games/inaka-drei-siegel/index.html`
- Alternativ ueber einen lokalen Server starten

## Steuerung

- Bewegen: `WASD` oder Pfeiltasten
- Interaktion / Dialog weiter: `E`
- Angriff (vorbereitet): `Leertaste`
- Debug-Overlay: `F1`
- Tile-Koordinaten-Einblendung: `F2`

## Map-System

Jede Map liegt zentral in `src/data/maps.js` und besitzt mindestens:

- `id`
- `name`
- `tileSize`
- `tiles` als 2D-Matrix
- `npcs`
- `enemies`
- `exits`
- optional `startPosition`

Die Welt wird im MVP ausschliesslich ueber die Tile-Matrix aufgebaut. Grosse Objekte wie Haeuser, Baeume, Felsen oder Schreine werden aktuell als einzelne `64x64`-Tiles umgesetzt.

## Tile-IDs

Alle Tile-Typen muessen in `src/data/tiles.js` in `TILE_DEFS` definiert sein. Rendering, Kollision und Interaktion leiten sich von dort ab.

- `G` = Gras, begehbar
- `W` = Wasser, nicht begehbar
- `P` = Weg, begehbar
- `T` = Baum, nicht begehbar
- `R` = Fels, nicht begehbar
- `B` = Bruecke, begehbar
- `H1` = kleines Haus, nicht begehbar, interagierbar
- `H2` = groesseres Haus, nicht begehbar, interagierbar
- `S` = Schrein, nicht begehbar, interagierbar
- `X` = Portal / verdorbener Boden, aktuell blockierend

## Neue Maps anlegen

1. In `src/data/maps.js` einen neuen Eintrag in `MAPS` anlegen
2. `tiles` als 2D-Matrix definieren
3. `npcs`, `enemies` und `exits` befuellen
4. Falls noetig `startPosition` setzen
5. Nur Tile-IDs verwenden, die bereits in `TILE_DEFS` vorhanden sind

## Architektur-Hinweise

- Keine externen Libraries
- Keine Build-Tools
- Platzhalter-Rendering ueber Farben, spaeter fuer echte Sprites aus `assets/tiles/` vorbereitet
- Dialoge liegen in `src/data/dialogues.js`
- Questflags liegen zentral im globalen `gameState`
