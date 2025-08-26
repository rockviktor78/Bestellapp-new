/**
 * Lädt HTML-Inhalte dynamisch in Elemente mit dem Attribut w3-include-html
 */
function includeHTML() {
  const elements = document.querySelectorAll("[w3-include-html]");

  elements.forEach(async (element) => {
    const file = element.getAttribute("w3-include-html");

    if (file) {
      try {
        const response = await fetch(file);

        if (response.ok) {
          const html = await response.text();
          element.innerHTML = html;
          element.removeAttribute("w3-include-html");

          // Trigger custom event nach dem Laden
          const event = new CustomEvent("htmlIncluded", {
            detail: { element: element, file: file },
          });
          document.dispatchEvent(event);
        } else {
          element.innerHTML = `<p>Fehler beim Laden: ${file}</p>`;
        }
      } catch (error) {
        console.error(`Fehler beim Laden von ${file}:`, error);
        element.innerHTML = `<p>Fehler beim Laden: ${file}</p>`;
      }
    }
  });
}

// Automatisch ausführen wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", includeHTML);

// Export für Module (falls verwendet)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { includeHTML };
}
