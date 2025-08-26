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
    this.init();
  }

  init() {
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
  }

  navigateToHome() {
    console.log("Navigiere zu Home");
    this.closeMenuIfOpen();
    // Hier würde die Navigation implementiert werden
  }

  navigateToMenu() {
    console.log("Navigiere zu Speisekarte");
    this.closeMenuIfOpen();
    // Hier würde die Navigation implementiert werden
  }

  navigateToAbout() {
    console.log("Navigiere zu Über uns");
    this.closeMenuIfOpen();
    // Hier würde die Navigation implementiert werden
  }

  navigateToContact() {
    console.log("Navigiere zu Kontakt");
    this.closeMenuIfOpen();
    // Hier würde die Navigation implementiert werden
  }

  navigateToBasket() {
    console.log("Navigiere zu Warenkorb");
    this.closeMenuIfOpen();
    // Hier würde die Navigation implementiert werden
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
}

// Event Listener für verschiedene Initialisierungsszenarien
document.addEventListener("DOMContentLoaded", initNavigation);
document.addEventListener("htmlIncluded", initNavigation);

// Export für Module
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MobileNavigation, NavigationHandler, initNavigation };
}
