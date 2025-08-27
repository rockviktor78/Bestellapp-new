/**
 * Mobile Navigation Handler - Verwaltet das mobile Menü
 */
class MobileNavigation {
  /**
   * Konstruktor für Mobile Navigation
   */
  constructor() {
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
    this.mobileMenu = document.getElementById("mobileMenu");
    this.mobileMenuClose = document.getElementById("mobileMenuClose");

    this.init();
  }

  /**
   * Initialisiert die mobile Navigation Event Listener
   */
  init() {
    if (this.mobileMenuToggle && this.mobileMenu && this.mobileMenuClose) {
      this.mobileMenuToggle.addEventListener("click", () => this.toggleMenu());
      this.mobileMenuClose.addEventListener("click", () => this.closeMenu());

      // Schließe Menü beim Klick außerhalb
      document.addEventListener("click", (e) => this.handleOutsideClick(e));
    }
  }

  /**
   * Öffnet oder schließt das mobile Menü
   */
  toggleMenu() {
    const isOpen = this.mobileMenu.classList.contains(
      "header_mobile-menu--open"
    );

    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Öffnet das mobile Menü
   */
  openMenu() {
    this.mobileMenu.classList.add("header_mobile-menu--open");
    this.mobileMenuToggle.setAttribute("aria-label", "Menü schließen");
    document.body.style.overflow = "hidden"; // Verhindert scrollen
  }

  /**
   * Schließt das mobile Menü
   */
  closeMenu() {
    this.mobileMenu.classList.remove("header_mobile-menu--open");
    this.mobileMenuToggle.setAttribute("aria-label", "Menü öffnen");
    document.body.style.overflow = ""; // Erlaubt wieder scrollen
  }

  /**
   * Behandelt Klicks außerhalb des mobilen Menüs
   * @param {Event} event - Das Click-Event
   */
  handleOutsideClick(event) {
    const isMenuOpen = this.mobileMenu.classList.contains(
      "header_mobile-menu--open"
    );
    const clickedInsideMenu = this.mobileMenu.contains(event.target);
    const clickedToggle = this.mobileMenuToggle.contains(event.target);

    if (isMenuOpen && !clickedInsideMenu && !clickedToggle) {
      this.closeMenu();
    }
  }
}

/**
 * Navigation Handler für alle Buttons - Verwaltet die Seitennavigation
 */
class NavigationHandler {
  /**
   * Konstruktor für Navigation Handler
   */
  constructor() {
    this.contentContainer = document.getElementById("content");
    this.currentPage = "home";
    this.init();
  }

  /**
   * Initialisiert alle Navigation Event Listener
   */
  init() {
    // Logo Button
    document
      .getElementById("logoHomeBtn")
      ?.addEventListener("click", () => this.navigateToHome());

    // Mobile Navigation Buttons
    document
      .getElementById("mobileHomeBtn")
      ?.addEventListener("click", () => this.navigateToHome());
    document
      .getElementById("mobileMenuBtn")
      ?.addEventListener("click", () => this.navigateToMenu());
    document
      .getElementById("mobileAboutBtn")
      ?.addEventListener("click", () => this.navigateToAbout());
    document
      .getElementById("mobileContactBtn")
      ?.addEventListener("click", () => this.navigateToContact());
    document
      .getElementById("mobileBasketBtn")
      ?.addEventListener("click", () => this.navigateToBasket());

    // Desktop Navigation Buttons
    document
      .getElementById("homeBtn")
      ?.addEventListener("click", () => this.navigateToHome());
    document
      .getElementById("menuBtn")
      ?.addEventListener("click", () => this.navigateToMenu());
    document
      .getElementById("aboutBtn")
      ?.addEventListener("click", () => this.navigateToAbout());
    document
      .getElementById("contactBtn")
      ?.addEventListener("click", () => this.navigateToContact());
    document
      .getElementById("basketBtn")
      ?.addEventListener("click", () => this.navigateToBasket());

    // Event Listener für dynamisch geladene Inhalte
    this.initDynamicEventListeners();
  }

  /**
   * Initialisiert Event Listener für dynamisch geladene Inhalte
   */
  initDynamicEventListeners() {
    // Hero Button Event Listener
    document.addEventListener("pageLoaded", (event) => {
      if (event.detail.page === "home") {
        const heroBtn = document.getElementById("heroOrderBtn");
        if (heroBtn) {
          heroBtn.addEventListener("click", () => {
            this.navigateToMenu();
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        }

        // Feature Cards Event Listeners
        this.initFeatureCards();
      }

      // Contact Form Handler
      if (event.detail.page === "contact") {
        this.initContactForm();
      }
    });
  }

  /**
   * Initialisiert das Kontaktformular mit Validierung
   */
  initContactForm() {
    const contactForm = document.querySelector(".form");
    const formBtn = document.querySelector(".form_btn");

    if (contactForm && formBtn) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Hole alle Input-Felder
        const nameInput = contactForm.querySelector(
          'input[placeholder="Name"]'
        );
        const emailInput = contactForm.querySelector(
          'input[placeholder="E-Mail"]'
        );
        const messageInput = contactForm.querySelector(
          'textarea[placeholder="Nachricht"]'
        );

        // Prüfe ob alle Felder ausgefüllt sind
        if (
          !nameInput.value.trim() ||
          !emailInput.value.trim() ||
          !messageInput.value.trim()
        ) {
          this.showErrorPopup("Bitte füllen Sie alle Felder aus!");
          return;
        }

        // Prüfe E-Mail Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          this.showErrorPopup(
            "Bitte geben Sie eine gültige E-Mail-Adresse ein!"
          );
          return;
        }

        // Zeige Loading-Zustand
        formBtn.textContent = "Wird gesendet...";
        formBtn.disabled = true;

        // Simuliere das Senden (nach 1 Sekunde)
        setTimeout(() => {
          // Zeige Erfolgs-Popup
          this.showSuccessPopup();

          // Reset Form
          contactForm.reset();
          formBtn.textContent = "Senden";
          formBtn.disabled = false;
        }, 1000);
      });
    }
  }

  /**
   * Zeigt ein Erfolgs-Popup an
   */
  showSuccessPopup() {
    const popup = document.createElement("div");
    popup.className = "success-popup";
    popup.innerHTML = `
      <div class="success-popup_content success-popup_content--success">
        <span class="success-popup_icon">✅</span>
        <p class="success-popup_text">Nachricht erfolgreich gesendet!</p>
      </div>
    `;
    this.showPopup(popup);
  }

  /**
   * Zeigt ein Fehler-Popup an
   * @param {string} message - Die Fehlermeldung
   */
  showErrorPopup(message) {
    const popup = document.createElement("div");
    popup.className = "success-popup";
    popup.innerHTML = `
      <div class="success-popup_content success-popup_content--error">
        <span class="success-popup_icon">❌</span>
        <p class="success-popup_text">${message}</p>
      </div>
    `;
    this.showPopup(popup);
  }

  /**
   * Zeigt ein Popup an der korrekten Position
   * @param {HTMLElement} popup - Das Popup-Element
   */
  showPopup(popup) {
    // Finde den Form-Button als Referenzpunkt
    const formBtn = document.querySelector(".form_btn");

    if (formBtn) {
      // Positioniere Popup relativ zum Form-Button
      const btnRect = formBtn.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      popup.style.position = "absolute";
      popup.style.top = `${btnRect.bottom + scrollTop + 10}px`;
      popup.style.left = `${btnRect.left}px`;
      popup.style.right = "auto";
      popup.style.transform = "none";
    }

    document.body.appendChild(popup);

    // Zeige Popup
    setTimeout(() => popup.classList.add("success-popup--show"), 10);

    // Verstecke Popup nach 3 Sekunden
    setTimeout(() => {
      popup.classList.remove("success-popup--show");
      setTimeout(() => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Initialisiert Event Listener für Feature Cards
   */
  initFeatureCards() {
    // Pizza Feature Card
    const pizzaCard = document.getElementById("pizzaFeatureCard");
    if (pizzaCard) {
      pizzaCard.addEventListener("click", () => {
        this.navigateToMenuCategory("pizza");
      });
    }

    // Pasta Feature Card
    const pastaCard = document.getElementById("pastaFeatureCard");
    if (pastaCard) {
      pastaCard.addEventListener("click", () => {
        this.navigateToMenuCategory("pasta");
      });
    }

    // Salad Feature Card
    const saladCard = document.getElementById("saladFeatureCard");
    if (saladCard) {
      saladCard.addEventListener("click", () => {
        this.navigateToMenuCategory("salad");
      });
    }

    // Dessert Feature Card
    const dessertCard = document.getElementById("dessertFeatureCard");
    if (dessertCard) {
      dessertCard.addEventListener("click", () => {
        this.navigateToMenuCategory("dessert");
      });
    }

    // Delivery Feature Card (führt zur allgemeinen Speisekarte)
    const deliveryCard = document.getElementById("deliveryFeatureCard");
    if (deliveryCard) {
      deliveryCard.addEventListener("click", () => {
        this.navigateToMenu();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /**
   * Lädt Content von einem Template-Pfad
   * @param {string} templatePath - Pfad zum Template
   * @param {string} pageName - Name der Seite
   */
  async loadContent(templatePath, pageName) {
    if (!this.contentContainer) return;

    try {
      const response = await fetch(templatePath);
      if (response.ok) {
        const html = await response.text();
        this.contentContainer.innerHTML = html;
        this.currentPage = pageName;

        // Update active navigation states
        this.updateActiveStates();

        // Trigger custom event für page-spezifische Initialisierung
        const event = new CustomEvent("pageLoaded", {
          detail: { page: pageName, container: this.contentContainer },
        });
        document.dispatchEvent(event);

        // Force FAB update after content load
        if (pageName === "menu" && window.cartHandler) {
          setTimeout(() => {
            window.cartHandler.showMobileCartFAB();
          }, 100);
        }

        console.log(`Navigiert zu ${pageName}`);
      } else {
        console.error(`Fehler beim Laden von ${templatePath}`);
      }
    } catch (error) {
      console.error(`Fehler beim Laden von ${templatePath}:`, error);
    }

    this.closeMenuIfOpen();
  }

  /**
   * Aktualisiert die aktiven Zustände der Navigation Buttons
   */
  updateActiveStates() {
    // Entferne alle aktiven Zustände
    document
      .querySelectorAll(".header_nav-btn, .header_mobile-btn")
      .forEach((btn) => {
        btn.classList.remove("active");
      });

    // Setze aktiven Zustand basierend auf aktueller Seite
    const activeButtons = {
      home: ["homeBtn", "mobileHomeBtn"],
      menu: ["menuBtn", "mobileMenuBtn"],
      about: ["aboutBtn", "mobileAboutBtn"],
      contact: ["contactBtn", "mobileContactBtn"],
    };

    if (activeButtons[this.currentPage]) {
      activeButtons[this.currentPage].forEach((btnId) => {
        const btn = document.getElementById(btnId);
        if (btn && !btn.classList.contains("header_nav-btn--basket")) {
          btn.classList.add("active");
        }
      });
    }
  }

  /**
   * Navigiert zur Home-Seite
   */
  navigateToHome() {
    this.loadContent("templates/home-content.html", "home");
  }

  /**
   * Navigiert zur Speisekarte
   */
  navigateToMenu() {
    this.loadContent("templates/menu-content.html", "menu");
  }

  /**
   * Navigiert zur Über-uns-Seite
   */
  navigateToAbout() {
    this.loadContent("templates/about-content.html", "about");
  }

  /**
   * Navigiert zur Kontakt-Seite
   */
  navigateToContact() {
    this.loadContent("templates/contact-content.html", "contact");
  }

  /**
   * Navigiert zur Datenschutz-Seite
   */
  navigateToPrivacy() {
    this.loadContent("templates/privacy-content.html", "privacy");
  }

  /**
   * Navigiert zum Warenkorb
   */
  navigateToBasket() {
    console.log("Navigiere zu Warenkorb");
    this.closeMenuIfOpen();
    // Hier würde die Warenkorb-Logik implementiert werden
  }

  /**
   * Navigiert zu einer bestimmten Menü-Kategorie
   * @param {string} category - Die Kategorie (pizza, pasta, etc.)
   */
  navigateToMenuCategory(category) {
    // Navigiere zur Speisekarte
    this.navigateToMenu();

    // Scroll zur entsprechenden Kategorie nach dem Laden
    setTimeout(() => {
      const categoryElement =
        document.querySelector(`[data-category="${category}"]`) ||
        document.querySelector(`.category_title:contains("${category}")`);
      if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  }

  /**
   * Schließt das mobile Menü falls es geöffnet ist
   */
  closeMenuIfOpen() {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu?.classList.contains("header_mobile-menu--open")) {
      mobileMenu.classList.remove("header_mobile-menu--open");
      document.body.style.overflow = "";
    }
  }
}

/**
 * Initialisiert die Navigation nach DOM Load
 */
function initNavigation() {
  new MobileNavigation();
  window.navigationHandler = new NavigationHandler(); // Global verfügbar machen
}

// Event Listener für verschiedene Initialisierungsszenarien
document.addEventListener("DOMContentLoaded", initNavigation);
document.addEventListener("htmlIncluded", initNavigation);

// Export für Module
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MobileNavigation, NavigationHandler, initNavigation };
}
