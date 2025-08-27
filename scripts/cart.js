/**
 * Warenkorb Handler
 */
class CartHandler {
  constructor() {
    this.cart = [];
    this.cartCount = 0;
    this.cartModal = null;
    this.init();
  }

  async init() {
    await this.loadCartModal();
    this.updateCartDisplay();
    this.initAddButtons();
    this.initCartModal();

    // Event Listener für dynamisch geladene Inhalte
    document.addEventListener("pageLoaded", (event) => {
      if (event.detail.page === "menu") {
        this.initAddButtons();
      }
    });
  }

  async loadCartModal() {
    try {
      const response = await fetch("templates/cart-modal.html");
      if (response.ok) {
        const html = await response.text();
        document.body.insertAdjacentHTML("beforeend", html);
        this.cartModal = document.getElementById("cartModal");
      }
    } catch (error) {
      console.error("Fehler beim Laden des Warenkorb-Modals:", error);
    }
  }

  initCartModal() {
    // Cart Modal Event Listeners
    document
      .getElementById("basketBtn")
      ?.addEventListener("click", () => this.openCartModal());
    document
      .getElementById("mobileBasketBtn")
      ?.addEventListener("click", () => this.openCartModal());
    document
      .getElementById("cartModalClose")
      ?.addEventListener("click", () => this.closeCartModal());
    document
      .getElementById("cartModalOverlay")
      ?.addEventListener("click", () => this.closeCartModal());
    document
      .getElementById("cartEmptyMenuBtn")
      ?.addEventListener("click", () => {
        this.closeCartModal();
        // Navigation zur Speisekarte
        window.dispatchEvent(new CustomEvent("navigateToMenu"));
      });
  }

  openCartModal() {
    if (this.cartModal) {
      this.cartModal.classList.add("cart-modal--open");
      document.body.style.overflow = "hidden";
      this.renderCartItems();
    }
  }

  closeCartModal() {
    if (this.cartModal) {
      this.cartModal.classList.remove("cart-modal--open");
      document.body.style.overflow = "";
    }
  }

  renderCartItems() {
    const cartEmpty = document.getElementById("cartEmpty");
    const cartItems = document.getElementById("cartItems");
    const cartFooter = document.getElementById("cartModalFooter");

    if (this.cart.length === 0) {
      cartEmpty.style.display = "block";
      cartItems.innerHTML = "";
      cartFooter.style.display = "none";
    } else {
      cartEmpty.style.display = "none";
      cartFooter.style.display = "block";

      cartItems.innerHTML = this.cart
        .map(
          (item) => `
        <div class="cart-item">
          <div class="cart-item_info">
            <div class="cart-item_name">${item.name}</div>
            <div class="cart-item_price">${(item.price * item.quantity).toFixed(
              2
            )} €</div>
          </div>
          <div class="cart-item_controls">
            <button class="cart-item_btn" onclick="window.cartHandler.decreaseQuantity('${
              item.name
            }')">−</button>
            <span class="cart-item_quantity">${item.quantity}</span>
            <button class="cart-item_btn" onclick="window.cartHandler.increaseQuantity('${
              item.name
            }')">+</button>
          </div>
        </div>
      `
        )
        .join("");

      document.getElementById(
        "cartTotalAmount"
      ).textContent = `${this.getCartTotal().toFixed(2)} €`;
    }
  }

  increaseQuantity(name) {
    const item = this.cart.find((item) => item.name === name);
    if (item) {
      item.quantity += 1;
      this.cartCount += 1;
      this.updateCartDisplay();
      this.renderCartItems();
    }
  }

  decreaseQuantity(name) {
    const item = this.cart.find((item) => item.name === name);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.cartCount -= 1;
    } else if (item) {
      this.cart = this.cart.filter((cartItem) => cartItem.name !== name);
      this.cartCount -= 1;
    }
    this.updateCartDisplay();
    this.renderCartItems();
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
