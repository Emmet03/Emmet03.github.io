# Todo's fuer Pirate Game

## Erledigt
- Erledigt: Projekt aufraeumen -> mehr Struktur, JS auf verschiedene Dateien aufteilen wenn moeglich
- Erledigt: Emoji-"Partikel"-Effekte z.B. holz oder gold emojis erscheinen wie ein partikel effekt beim einsammeln
- Erledigt: freundliche schiffe, die sich nicht oder nur schlecht wehren koennen (haendler, zivilisten)
- Erledigt: Generierte Map -> inselnamen generieren z.b. 2 arrays [Gold, Faehr, Lever, ...], [haven, bergen, kusen, ...] -> groessere map
- Erledigt: pirateisland.png als pirateninseln einfuehren, wo man upgrades machen kann. reperieren soll weiterhin auf hoher see funktionieren.
- Erledigt: mehr indikatoren im kampf vorallem fuers gewinnen und verlieren. vielleicht auch die schiffe im modal zeigen
- Erledigt: an der pirateninsel das menue als modal (wie das kampf modal) zeigen und sonst nicht sichtbar. Ausserdem soll man an der pirateninsel nicht angegriffen werden koennen
- Erledigt: partikel groesser machen
- Erledigt: Aktuell kann man den kompass nicht sehen, wenn man einen inselnamen sieht, den kompass dann daneben schieben
- Erledigt: vielleicht koennte das spieler schiff mit den bestehenden namensupgrades immer etwas groesser
- Erledigt: kollision fuer inseln
- Erledigt: nicht sofort stehen bleiben wenn man nicht mehr drueckt, ein bisschen schlittern und ein ganz leichtes ziehen in windrichtung
- Erledigt: es ist nicht das ganze menue im screen
- Erledigt: Aktuell wenn man stirbt kommt man ja zur startinsel zurueck. Es sollte einen Game-Over-Screen geben
- Erledigt: "minimap", vielleicht mit Gegnerposition im Kompass
- Erledigt: Quests koennen am Piratenhafen angenommen werden, mit modularer Struktur
  - Erledigt: Liefere X Gold zu einem Piratenhafen
  - Erledigt: Pluendere 2 bestimmte Inseln
  - Erledigt: Versenke 1 feindliches Kriegsschiff
  - Erledigt: Jage einen besonderen Piratenkapitaen
  - Erledigt: Sammle eine bestimmte Menge Holz, Munition oder Gold und bringe sie zu Piratenhafen X
  - Erledigt: Transportiere eine Schatzkarte oder geheime Nachricht von Insel A nach Insel B
- Erledigt: Wetter
  - Erledigt: Sturm mit starker Drift und schlechterer Steuerung
  - Erledigt: Nebel mit geringerer Sicht auf Inseln und Schiffe
  - Erledigt: Regen fuer Stimmung und leicht reduzierte Sicht
  - Erledigt: Gewitter als seltenes Gefahren-Event
  - Erledigt: regionale Stroemungen, die das Schiff mitziehen
  - Erledigt: besondere Rueckenwind-Zonen
- Erledigt: Questmarker auf der Karte
- Erledigt: Info ueber laufende Quest auf Pirateninsel statt nur neuem Auftrag
- Erledigt: Info ueber Quest-Belohnung
- Erledigt: Quest-Belohnung steigt mit Level
- Erledigt: Infos zu Steuerung und Piratenhafen nur noch auf Klick auf ein Info-Symbol
- Erledigt: Wetterzyklus langsamer und dynamischer mit mehr Sonne und weniger Regen/Sturm
- Erledigt: Schiffe die man beinahe zerstoert hat kann man manchmal rekrutieren, die fuer den Spieler dann Inseln looten
- Erledigt: Steuerung auch mit Pfeiltasten ermoeglichen
- Erledigt: Beim Start Kapitaen und Schiff benennen (zufaellige Namen als Standard)
- Erledigt: Erste seltene Schiffsmodule in der Werft: gepanzerter Bug und Brandmunition

## Offen
- Neue Ideen fuer Progression
  - Eigene kleine Piratenbasis als Spaetspielziel

- Neue Ideen rund um die Flotte
  - Kleine Crewkosten oder Unterhalt, damit die Flotte eine strategische Entscheidung bleibt
  - Flottenverluste bei schweren Kaempfen oder Stuermevents
  - Flaggschiff-Boni: je nach Spieler-Upgrade verhalten sich Begleitschiffe besser

- Neue Ideen fuer die Welt
  - Neutrale Haefen mit Marktpreisen fuer Holz, Munition und Gold-bezogene Waren
  - Schatzwracks und Seenot-Events auf hoher See
  - Mehr Inseltypen: Schmugglernest, verlassene Insel, Schatzinsel

## Ideen sammeln
- Mobile Steuerung und UI-Anpassung
  - Linker virtueller Stick fuer Lenken und Beschleunigen
  - Rechte Action-Buttons fuer `Pluendern`, `Reparieren`, `Interagieren`
  - Kampf-Modal auf grosse Touch-Buttons umbauen
  - Sidebar auf Mobile als einklappbare Bottom-Sheets oder Tabs
  - Minimap kleiner oder einklappbar machen
  - Tooltips und Hover-Infos in tipbare Info-Karten umwandeln
  - Canvas-Hoehe und UI-Abstaende fuer Hochformat optimieren
  - Touch-Ziele groesser machen, vor allem in Werft und Flottenmenues
  - Auf der Karte Schiffe/Inseln antippbar machen, damit man nicht nur mit Tasten interagiert
  - Optional: Auto-Vorwaertsfahrt auf Mobile, damit man nicht gleichzeitig lenken und Gas halten muss

- Mobile Umsetzungsidee
  - Desktop und Mobile nicht nur per CSS unterscheiden, sondern eigene Eingabeebene in `main.js`
  - Eingabequelle als Zustand verwalten: `keyboard` oder `touch`
  - Virtuellen Stick als Overlay-Element ueber dem Canvas zeichnen oder per HTML layern
  - Kampf und Werft eher als vertikale Karten mit grossen Buttons statt dichter Desktop-Panelstruktur
  - Flotten- und Questinfos auf Mobile eher in 1-2 fokussierten Karten statt kompletter Sidebar

- Mobile Komfortfeatures
  - Pause-Button oben rechts
  - Haptisches Feedback bei Kampfaktionen oder Loot
  - Wichtige Aktionen unten am Daumenbereich verankern
  - Optional reduzierter Partikeleffekt-Modus fuer schwache Geraete
  - Optional Kamera-Zoom etwas naeher fuer kleine Screens
