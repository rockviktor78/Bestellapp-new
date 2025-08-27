/**
 * Warenkorb-Management für das Restaurant
 */
class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.basketCountElements = [];
    this.init();
  }

  init() {
    // Lade gespeicherte Daten
    this.loadFromStorage();

    // Initialisiere Counter-Elemente
    this.basketCountElements = [
      document.getElementById("basketCount"),
      document.getElementById("mobileBasketCount"),
    ].filter((el) => el !== null);

    // Update initial display
    this.updateDisplay();

    // Event Listener für Add-Buttons
    document.addEventListener("pageLoaded", (event) => {
      if (event.detail.page === "menu") {
        this.attachMenuEventListeners();
      }
    });

    // Event Listener für Warenkorb-Buttons
    document
      .getElementById("basketBtn")
      ?.addEventListener("click", () => this.showCart());
    document
      .getElementById("mobileBasketBtn")
      ?.addEventListener("click", () => this.showCart());
  }

  attachMenuEventListeners() {
    const addButtons = document.querySelectorAll(".add_btn");
    addButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const name = btn.getAttribute("data-name");
        const price = parseFloat(btn.getAttribute("data-price"));

        if (name && price) {
          this.addItem({ name, price });
          this.showAddAnimation(btn);
        }
      });
    });
  }

  addItem(item) {
    const existingItem = this.items.find(
      (cartItem) => cartItem.name === item.name
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }

    this.calculateTotal();
    this.updateDisplay();
    this.saveToStorage();

    console.log(`${item.name} zum Warenkorb hinzugefügt`);
  }

  removeItem(itemName) {
    const itemIndex = this.items.findIndex((item) => item.name === itemName);
    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1);
      this.calculateTotal();
      this.updateDisplay();
      this.saveToStorage();
      this.refreshCartDisplay();
    }
  }

  updateQuantity(itemName, newQuantity) {
    const item = this.items.find((cartItem) => cartItem.name === itemName);
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(itemName);
      } else {
        item.quantity = parseInt(newQuantity);
        this.calculateTotal();
        this.updateDisplay();
        this.saveToStorage();
        this.refreshCartDisplay();
      }
    }
  }

  increaseQuantity(itemName) {
    const item = this.items.find((cartItem) => cartItem.name === itemName);
    if (item) {
      item.quantity += 1;
      this.calculateTotal();
      this.updateDisplay();
      this.saveToStorage();
      this.refreshCartDisplay();
    }
  }

  decreaseQuantity(itemName) {
    const item = this.items.find((cartItem) => cartItem.name === itemName);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        this.calculateTotal();
        this.updateDisplay();
        this.saveToStorage();
        this.refreshCartDisplay();
      } else {
        this.removeItem(itemName);
      }
    }
  }

  calculateTotal() {
    this.total = this.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }

  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateDisplay() {
    const totalItems = this.getTotalItems();
    this.basketCountElements.forEach((element) => {
      if (element) {
        element.textContent = totalItems;
      }
    });
  }

  refreshCartDisplay() {
    const existingModal = document.getElementById("cartModal");
    if (existingModal) {
      existingModal.remove();
      this.showCart();
    }
  }

  showAddAnimation(button) {
    button.style.transform = "scale(1.2)";
    button.style.backgroundColor = "#27ae60";
    button.textContent = "✓";

    setTimeout(() => {
      button.style.transform = "scale(1)";
      button.style.backgroundColor = "#AB4C2F";
      button.textContent = "+";
    }, 300);
  }

  showCart() {
    if (this.items.length === 0) {
      this.showEmptyCart();
      return;
    }

    let cartHtml = '<div class="cart-overlay"><div class="cart-modal">';
    cartHtml +=
      '<button class="cart-close-x" onclick="cart.closeCart()">×</button>';
    cartHtml += "<h3>Ihr Warenkorb</h3>";
    cartHtml += '<div class="cart-items">';

    this.items.forEach((item, index) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      cartHtml += `
        <div class="cart-item" data-item="${item.name}">
          <div class="item-details">
            <span class="item-name">${item.name}</span>
            <span class="item-price">${item.price.toFixed(2)} € / Stück</span>
          </div>
          <div class="quantity-controls">
            <button class="qty-btn minus" onclick="cart.decreaseQuantity('${
              item.name
            }')">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="qty-btn plus" onclick="cart.increaseQuantity('${
              item.name
            }')">+</button>
          </div>
          <div class="item-total">${itemTotal} €</div>
          <button class="remove-btn" onclick="cart.removeItem('${
            item.name
          }')" title="Artikel entfernen">🗑️</button>
        </div>
      `;
    });

    cartHtml += "</div>";
    cartHtml += `<div class="cart-summary">`;
    cartHtml += `<div class="cart-total">Gesamt: ${this.total.toFixed(
      2
    )} €</div>`;
    cartHtml += `<div class="cart-item-count">${this.getTotalItems()} Artikel im Warenkorb</div>`;
    cartHtml += `</div>`;
    cartHtml += '<div class="cart-actions">';
    cartHtml +=
      '<button class="clear-cart" onclick="cart.clearCart()">Warenkorb leeren</button>';
    cartHtml +=
      '<button class="close-cart" onclick="cart.closeCart()">Weiter einkaufen</button>';
    cartHtml +=
      '<button class="checkout-btn" onclick="cart.checkout()">Jetzt bestellen</button>';
    cartHtml += "</div>";
    cartHtml += "</div></div>";

    // Modal in DOM einfügen
    const modalDiv = document.createElement("div");
    modalDiv.innerHTML = cartHtml;
    modalDiv.id = "cartModal";
    document.body.appendChild(modalDiv);

    // Close on overlay click
    modalDiv.querySelector(".cart-overlay").addEventListener("click", (e) => {
      if (e.target.classList.contains("cart-overlay")) {
        this.closeCart();
      }
    });

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  showEmptyCart() {
    let cartHtml =
      '<div class="cart-overlay"><div class="cart-modal cart-empty">';
    cartHtml +=
      '<button class="cart-close-x" onclick="cart.closeCart()">×</button>';
    cartHtml += "<h3>Ihr Warenkorb</h3>";
    cartHtml += '<div class="empty-cart-message">';
    cartHtml += '<span class="empty-icon">🛒</span>';
    cartHtml += "<p>Ihr Warenkorb ist noch leer</p>";
    cartHtml +=
      "<p>Stöbern Sie in unserer Speisekarte und fügen Sie leckere Gerichte hinzu!</p>";
    cartHtml += "</div>";
    cartHtml += '<div class="cart-actions">';
    cartHtml +=
      '<button class="close-cart" onclick="cart.closeCart()">Zur Speisekarte</button>';
    cartHtml += "</div>";
    cartHtml += "</div></div>";

    const modalDiv = document.createElement("div");
    modalDiv.innerHTML = cartHtml;
    modalDiv.id = "cartModal";
    document.body.appendChild(modalDiv);

    modalDiv.querySelector(".cart-overlay").addEventListener("click", (e) => {
      if (e.target.classList.contains("cart-overlay")) {
        this.closeCart();
      }
    });

    document.body.style.overflow = "hidden";
  }

  closeCart() {
    const modal = document.getElementById("cartModal");
    if (modal) {
      modal.remove();
    }
    document.body.style.overflow = "";
  }

  clearCart() {
    if (
      confirm("Möchten Sie wirklich alle Artikel aus dem Warenkorb entfernen?")
    ) {
      this.items = [];
      this.total = 0;
      this.updateDisplay();
      this.saveToStorage();
      this.closeCart();
    }
  }

  checkout() {
    if (this.items.length === 0) {
      alert("Ihr Warenkorb ist leer");
      return;
    }

    let orderSummary = "Ihre Bestellung:\n\n";
    this.items.forEach((item) => {
      orderSummary += `${item.quantity}x ${item.name} - ${(
        item.price * item.quantity
      ).toFixed(2)} €\n`;
    });
    orderSummary += `\nGesamtbetrag: ${this.total.toFixed(2)} €`;
    orderSummary += "\n\nVielen Dank für Ihre Bestellung!";

    alert(orderSummary);

    // Warenkorb leeren
    this.items = [];
    this.total = 0;
    this.updateDisplay();
    this.saveToStorage();
    this.closeCart();
  }

  saveToStorage() {
    try {
      const cartData = {
        items: this.items,
        total: this.total,
      };
      localStorage.setItem("restaurant_cart", JSON.stringify(cartData));
    } catch (error) {
      console.error("Fehler beim Speichern des Warenkorbs:", error);
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem("restaurant_cart");
      if (saved) {
        const cartData = JSON.parse(saved);
        this.items = cartData.items || [];
        this.total = cartData.total || 0;
      }
    } catch (error) {
      console.error("Fehler beim Laden des Warenkorbs:", error);
      this.items = [];
      this.total = 0;
    }
  }

  clearCart() {
    this.items = [];
    this.total = 0;
    this.updateDisplay();
    this.saveToStorage();
  }
}

// Globale Instanz erstellen
let cart;

// Initialisierung
function initCart() {
  if (!cart) {
    cart = new ShoppingCart();
  }
}

// Event Listener für verschiedene Initialisierungsszenarien
document.addEventListener("DOMContentLoaded", initCart);
document.addEventListener("htmlIncluded", initCart);

// Export für Module
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ShoppingCart };
}
