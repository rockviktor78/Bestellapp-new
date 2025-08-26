/**
 * Mobile Navigation Handler
 */
class MobileNavigation {
  constructor() {
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
    this.mobileMenu = document.getElementById("mobileMenu");
    this.mobileMenuClose = document.getElementById("mobileMenuClose");

    this.init();
  }

  init() {
    if (this.mobileMenuToggle && this.mobileMenu && this.mobileMenuClose) {
      this.mobileMenuToggle.addEventListener("click", () => this.toggleMenu());
      this.mobileMenuClose.addEventListener("click", () => this.closeMenu());

      // Schließe Menü beim Klick außerhalb
      document.addEventListener("click", (e) => this.handleOutsideClick(e));
    }
  }

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

  openMenu() {
    this.mobileMenu.classList.add("header_mobile-menu--open");
    this.mobileMenuToggle.setAttribute("aria-label", "Menü schließen");
    document.body.style.overflow = "hidden"; // Verhindert scrollen
  }

  closeMenu() {
    this.mobileMenu.classList.remove("header_mobile-menu--open");
    this.mobileMenuToggle.setAttribute("aria-label", "Menü öffnen");
    document.body.style.overflow = ""; // Erlaubt wieder scrollen
  }

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

// Navigation Handler für alle Buttons
class NavigationHandler {
  constructor() {
    this.contentContainer = document.getElementById("content");
    this.currentPage = "home";
    this.init();
  }

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

    // Hero Button Event Listener hinzufügen
    document.addEventListener("pageLoaded", () => {
      const heroBtn = document.getElementById("heroOrderBtn");
      if (heroBtn) {
        heroBtn.addEventListener("click", () => this.navigateToMenu());
      }

      // Re-initialize logo button after page load
      const logoBtn = document.getElementById("logoHomeBtn");
      if (logoBtn) {
        logoBtn.addEventListener("click", () => this.navigateToHome());
      }
    });
  }

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

        console.log(`Navigiert zu ${pageName}`);
      } else {
        console.error(`Fehler beim Laden von ${templatePath}`);
      }
    } catch (error) {
      console.error(`Fehler beim Laden von ${templatePath}:`, error);
    }

    this.closeMenuIfOpen();
  }

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

  navigateToHome() {
    this.loadContent("templates/home-content.html", "home");
  }

  navigateToMenu() {
    this.loadContent("templates/menu-content.html", "menu");
  }

  navigateToAbout() {
    this.loadContent("templates/about-content.html", "about");
  }

  navigateToContact() {
    this.loadContent("templates/contact-content.html", "contact");
  }

  navigateToBasket() {
    console.log("Navigiere zu Warenkorb");
    this.closeMenuIfOpen();
    // Hier würde die Warenkorb-Logik implementiert werden
  }

  closeMenuIfOpen() {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu?.classList.contains("header_mobile-menu--open")) {
      mobileMenu.classList.remove("header_mobile-menu--open");
      document.body.style.overflow = "";
    }
  }
}

// Initialisierung nach DOM Load oder HTML Include
function initNavigation() {
  new MobileNavigation();
  new NavigationHandler();

  // Re-initialize mobile navigation after HTML includes
  document.addEventListener("htmlIncluded", () => {
    const mobileNav = new MobileNavigation();
    const navHandler = new NavigationHandler();
  });
}

// Event Listener für verschiedene Initialisierungsszenarien
document.addEventListener("DOMContentLoaded", initNavigation);
document.addEventListener("htmlIncluded", initNavigation);

// Export für Module
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MobileNavigation, NavigationHandler, initNavigation };
}
