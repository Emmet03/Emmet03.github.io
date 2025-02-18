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
