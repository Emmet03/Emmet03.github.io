import os

# Verzeichnis mit deinen HTML-Seiten
PAGES_DIR = "InakaWiki/Pages"

# Titelzeile für den Bereich
html_output = []
html_output.append('            <h1>Alle Seiten</h1>')

# Seiten alphabetisch sammeln
files = [f for f in os.listdir(PAGES_DIR) if f.endswith(".html")]
files.sort(key=lambda x: x.lower())

# Nach Buchstaben gruppieren
grouped = {}
for file in files:
    display_name = file.replace(".html", "").replace("_", " ")
    if display_name is not "WikiPreset":
        first_letter = display_name[0].upper()
        grouped.setdefault(first_letter, []).append((file, display_name))

# HTML-Listenaufbau
for letter in sorted(grouped.keys()):
    html_output.append(f'            <h2>{letter}...</h2>')
    html_output.append('            <ul>')
    for file, name in grouped[letter]:
        html_output.append(f'                <li><a href="Pages/{file}">{name}</a></li>')
    html_output.append('            </ul>')

# Ausgabe als Text (einfach in dein HTML einfügen)
print("\n".join(html_output))
