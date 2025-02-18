document.addEventListener('DOMContentLoaded', function () {
    const loeschCheckbox = document.getElementById('löschung');
    const commentArea = document.getElementById('comment'); // Der Kommentarbereich
    const loeschLabel = document.getElementById('commentLabel'); // Das Label für "Löschung"
    const datenschutzLabel = document.getElementById('datenschutzLabel');

    // Funktion, die den Kommentarbereich und das Label ein- oder ausblendet
    function toggleVisibility() {
        if (loeschCheckbox.checked) {
            commentArea.style.display = 'none'; // Kommentarbereich verstecken
            loeschLabel.style.display = 'none'; // Lösch-Label verstecken
            datenschutzLabel.style.display = 'none'; // Datenschutz-Label verstecken
        } else {
            commentArea.style.display = 'block'; // Kommentarbereich anzeigen
            loeschLabel.style.display = 'block'; // Lösch-Label anzeigen
            datenschutzLabel.style.display = 'block'; // Datenschutz-Label anzeigen
        }
    }

    // Event Listener für den Zustand der Lösch-Checkbox
    loeschCheckbox.addEventListener('change', toggleVisibility);

    // Initialer Aufruf der Funktion, um den Kommentarbereich und das Label beim Laden der Seite korrekt zu setzen
    toggleVisibility();
});


document.addEventListener('DOMContentLoaded', function () {
    // Lade die JSON-Daten aus der Datei
    fetch('../Data/Gaestebuch.json')
        .then(response => {
            // Prüfen, ob die Antwort OK ist
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json(); // Parst die JSON-Daten
        })
        .then(commentsData => {
            // Selektiere die Comments-Sektion
            const commentsSection = document.querySelector('.comments');
            document.getElementById('Fehler').style.display = 'none';

            // Gehe durch alle Kommentare und füge sie zur Seite hinzu
            commentsData.forEach(comment => {
                // Erstelle das HTML-Element für jeden Kommentar
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');

                // Füge den Inhalt des Kommentars hinzu
                commentDiv.innerHTML = `
                        <h3>${comment.name}</h3>
                        <sup>${comment.Datum}</sup>
                        <p>${comment.Kommentar}</p>
                    `;

                // Füge das Kommentar-Element der Section hinzu
                commentsSection.appendChild(commentDiv);
            });
        })
        .catch(error => {
            // Fehlerbehandlung, falls die Datei nicht geladen werden kann
            console.error('Es gab ein Problem mit dem Abrufen der JSON-Datei:', error);
        });
});

function CreateMessage() {
    if (!ValidateForm()) {
        return;
    }
    const name = document.getElementById('pseudonym').value;
    const comment = document.getElementById('comment').value;
    const loeschung = document.getElementById('löschung').checked;

    const message = {
        name: name,
        comment: comment,
        loeschung: loeschung ? 'Ja' : 'Nein',
        datenschutz: datenschutz ? 'Ja' : 'Nein'
    };

    // Senden der Formulardaten an Google Apps Script über POST
    fetch("https://script.google.com/macros/s/AKfycbyQKUUbp1r42XOzpBEQmDQM3UTcpiKDOCOzz1Gnc7M1sL8-2jKc1i5a79HM2HbzHnbpPg/exec", {
        method: 'POST',
        body: new URLSearchParams(message),
    })
        .then(response => response.text())
        .then(result => alert('Nachricht erfolgreich gesendet: ' + result))
        .catch(error => alert('Fehler: ' + error));
}


function ValidateForm() {
    const name = document.getElementById('pseudonym').value;
    const comment = document.getElementById('comment').value;
    const loeschung = document.getElementById('löschung').checked;
    const datenschutz = document.getElementById('datenschutz').checked;
    const honeypot = document.getElementById('website').checked;

    if (name === '' || comment === '') {
        alert('Bitte füllen Sie alle Felder aus!');
        return false;
    }

    if (loeschung) {
        if (name === '') {
            alert('Bitte füllen Sie alle Felder aus!');
            return false;
        }
        else {
            return true;
        }
    }

    if (!datenschutz) {
        alert('Bitte akzeptieren Sie die Datenschutzbestimmungen!');
        return false;
    }

    if (honeypot) {
        return false;
    }

    return true;
}