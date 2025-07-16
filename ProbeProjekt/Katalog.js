let aktuelleIndex = 0;
let reifenListe = [];

async function ladeReifenDaten() {
    try {
        const response = await fetch('probearbeiten_assets/probearbeiten_assets/reifen_liste.json');
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        reifenListe = await response.json();
        zeigeReifen(aktuelleIndex);
    } catch (error) {
        console.error('Fehler beim Laden der Reifendaten:', error);
    }
}

function zeigeReifen(index) {
    const container = document.querySelector('.katalogContainer');
    const reifen = reifenListe[index];

    // Leeren und neu befüllen
    container.innerHTML = `
        <div class="katalogItem">
            <img src="probearbeiten_assets/probearbeiten_assets/${reifen.bild}" alt="${reifen.name}">
            <h3>${reifen.name}</h3>
            <p>${reifen.beschreibung}</p>
            <p>Preis: ${reifen.preis}</p>
            <button>Jetzt kaufen</button>
        </div>
    `;
}

function nextTire() {
    aktuelleIndex = (aktuelleIndex + 1) % reifenListe.length;
    zeigeReifen(aktuelleIndex);
}

function previousTire() {
    aktuelleIndex = (aktuelleIndex - 1 + reifenListe.length) % reifenListe.length;
    zeigeReifen(aktuelleIndex);
}


document.addEventListener('DOMContentLoaded', () => {
    ladeReifenDaten();

    const buttons = document.querySelectorAll('.pagination button');
    if (buttons.length === 2) {
        buttons[0].addEventListener('click', previousTire);
        buttons[1].addEventListener('click', nextTire);
    }
});
