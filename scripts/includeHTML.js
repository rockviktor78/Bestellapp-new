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

// Funktion zum Laden von Content in den content-Container
async function loadContentIntoMain(templatePath) {
  const contentContainer = document.getElementById("content");
  if (!contentContainer) {
    console.error("Content container not found");
    return;
  }

  try {
    const response = await fetch(templatePath);
    if (response.ok) {
      const html = await response.text();
      contentContainer.innerHTML = html;

      // Trigger custom event
      const event = new CustomEvent("contentLoaded", {
        detail: { template: templatePath },
      });
      document.dispatchEvent(event);

      console.log("Content loaded:", templatePath);
    } else {
      console.error(`Fehler beim Laden von ${templatePath}`);
      contentContainer.innerHTML = "<p>Fehler beim Laden des Inhalts.</p>";
    }
  } catch (error) {
    console.error(`Fehler beim Laden von ${templatePath}:`, error);
    contentContainer.innerHTML = "<p>Fehler beim Laden des Inhalts.</p>";
  }
}

// Event Listener für Footer Links
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("legal_link")) {
      e.preventDefault();
      const linkText = e.target.textContent.trim();

      if (linkText === "Datenschutz") {
        console.log("Loading Datenschutz content");
        loadContentIntoMain("templates/datenschutz-content.html");
      }
    }
  });
});

// Automatisch ausführen wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", includeHTML);

// Export für Module (falls verwendet)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { includeHTML };
}
