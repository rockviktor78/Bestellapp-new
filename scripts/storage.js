/**
 * Local Storage Handler
 */
class StorageHandler {
  constructor() {
    this.storageKey = "mampfen-rando-cart";
  }

  saveCart(cartData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cartData));
    } catch (error) {
      console.error("Fehler beim Speichern des Warenkorbs:", error);
    }
  }

  loadCart() {
    try {
      const cartData = localStorage.getItem(this.storageKey);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Fehler beim Laden des Warenkorbs:", error);
      return [];
    }
  }

  clearCart() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error("Fehler beim Löschen des Warenkorbs:", error);
    }
  }
}

// Global verfügbar machen
window.storageHandler = new StorageHandler();

// Export für Module
if (typeof module !== "undefined" && module.exports) {
  module.exports = { StorageHandler };
}
