/**
 * Warenkorb Handler
 */
class CartHandler {
  constructor() {
    this.cart = [];
    this.cartCount = 0;
    this.init();
  }

  init() {
    this.updateCartDisplay();
    this.initAddButtons();

    // Event Listener für dynamisch geladene Inhalte
    document.addEventListener("pageLoaded", (event) => {
      if (event.detail.page === "menu") {
        this.initAddButtons();
      }
    });
  }

  initAddButtons() {
    // Add-to-cart Buttons in der Speisekarte
    document.querySelectorAll(".add_btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const dishName = btn.getAttribute("data-name");
        const dishPrice = parseFloat(btn.getAttribute("data-price"));
        this.addToCart(dishName, dishPrice);
      });
    });
  }

  addToCart(name, price) {
    const existingItem = this.cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        name: name,
        price: price,
        quantity: 1,
      });
    }

    this.cartCount += 1;
    this.updateCartDisplay();

    console.log(`${name} zum Warenkorb hinzugefügt`);
  }

  updateCartDisplay() {
    // Update cart count in header
    const basketCount = document.getElementById("basketCount");
    const mobileBasketCount = document.getElementById("mobileBasketCount");

    if (basketCount) basketCount.textContent = this.cartCount;
    if (mobileBasketCount) mobileBasketCount.textContent = this.cartCount;
  }

  getCart() {
    return this.cart;
  }

  getCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}

// Global verfügbar machen
window.cartHandler = new CartHandler();

// Export für Module
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CartHandler };
}
