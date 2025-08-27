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
    this.createMobileCartFAB();
    this.updateCartDisplay();
    this.initAddButtons();
    this.initCartModal();

    // Event Listener für dynamisch geladene Inhalte
    document.addEventListener("pageLoaded", (event) => {
      if (event.detail.page === "menu") {
        this.initAddButtons();
        this.showMobileCartFAB();
      } else {
        this.hideMobileCartFAB();
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

  createMobileCartFAB() {
    // Prüfe ob FAB bereits existiert
    if (document.getElementById("mobileCartFAB")) return;

    const fab = document.createElement("button");
    fab.id = "mobileCartFAB";
    fab.className = "mobile-cart-fab";
    fab.innerHTML = `
      🛒
      <span class="mobile-cart-fab_count" id="mobileCartFABCount">0</span>
    `;
    fab.style.display = "none";

    // Event Listener für FAB
    fab.addEventListener("click", () => {
      this.openCartModal();
    });

    return fab;
  }

  initCartModal() {
    console.log("Initializing cart modal...");
    document.addEventListener("click", (e) => {
      console.log("Click detected:", e.target.id);
      if (
        e.target.id === "basketBtn" ||
        e.target.id === "mobileBasketBtn" ||
        e.target.id === "mobileCartFAB"
      ) {
        console.log("Cart button clicked!");
        e.preventDefault();
        e.stopPropagation();
        this.openCartModal();
      } else if (
        e.target.id === "cartModalClose" ||
        e.target.id === "cartModalOverlay"
      ) {
        this.closeCartModal();
      } else if (e.target.id === "cartEmptyMenuBtn") {
        this.closeCartModal();
        if (window.navigationHandler) {
          window.navigationHandler.navigateToMenu();
        }
      }
    });
  }

  openCartModal() {
    console.log("Opening cart modal...", this.cartModal);
    if (this.cartModal) {
      this.cartModal.classList.add("cart-modal--open");
      document.body.style.overflow = "hidden";
      this.renderCartItems();
      console.log("Cart modal should be open now");
    } else {
      console.error("Cart modal not found!");
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
      this.updateCartDisplay();
      this.renderCartItems();
    } else if (item) {
      this.cart = this.cart.filter((cartItem) => cartItem.name !== name);
      this.cartCount -= 1;
      this.updateCartDisplay();
      this.renderCartItems();
    }
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

  showMobileCartFAB() {
    console.log("showMobileCartFAB called, window width:", window.innerWidth);

    const fab = document.getElementById("mobileCartFAB");
    if (fab) {
      if (window.innerWidth <= 767) {
        fab.style.display = "flex";
        console.log("FAB made visible for mobile");
      } else {
        fab.style.display = "none";
        console.log("FAB hidden for desktop");
      }
    }
  }

  hideMobileCartFAB() {
    const fab = document.getElementById("mobileCartFAB");
    if (fab) {
      fab.style.display = "none";
    }
  }

  updateCartDisplay() {
    // Update cart count in header
    const basketCount = document.getElementById("basketCount");
    const mobileBasketCount = document.getElementById("mobileBasketCount");
    const fabCount = document.getElementById("mobileCartFABCount");

    if (basketCount) basketCount.textContent = this.cartCount;
    if (mobileBasketCount) mobileBasketCount.textContent = this.cartCount;
    if (fabCount) {
      fabCount.textContent = this.cartCount;
      fabCount.style.display = this.cartCount > 0 ? "flex" : "none";
    }
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
