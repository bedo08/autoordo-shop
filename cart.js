(function () {
  const STORAGE_KEY = "autoordo_cart";
  const fmt = (n) => n.toFixed(2).replace(".", ",") + " €";

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addToCart(id, name, price) {
    const cart = loadCart();
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    saveCart(cart);
    render();
    openCart();
  }

  function changeQty(id, delta) {
    let cart = loadCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.id !== id);
    }
    saveCart(cart);
    render();
  }

  function removeItem(id) {
    const cart = loadCart().filter((i) => i.id !== id);
    saveCart(cart);
    render();
  }

  function render() {
    const cart = loadCart();
    const itemsEl = document.getElementById("cartItems");
    const countEl = document.getElementById("cartCount");
    const subtotalEl = document.getElementById("cartSubtotal");
    if (!itemsEl) return;

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    countEl.textContent = totalQty;

    if (cart.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">Dein Warenkorb ist leer.</p>';
    } else {
      itemsEl.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-qty">
              <button data-action="dec" data-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button data-action="inc" data-id="${item.id}">+</button>
              <button class="cart-item-remove" data-action="remove" data-id="${item.id}">entfernen</button>
            </div>
          </div>
          <div class="cart-item-price">${fmt(item.price * item.qty)}</div>
        </div>`
        )
        .join("");
    }

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    subtotalEl.textContent = fmt(subtotal);
  }

  function openCart() {
    document.getElementById("cartPanel").classList.add("open");
    document.getElementById("cartOverlay").classList.add("open");
  }

  function closeCart() {
    document.getElementById("cartPanel").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("open");
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();

    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", () => {
        addToCart(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price));
      });
    });

    document.getElementById("cartToggle").addEventListener("click", openCart);
    document.getElementById("cartClose").addEventListener("click", closeCart);
    document.getElementById("cartOverlay").addEventListener("click", closeCart);

    document.getElementById("cartItems").addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      const id = e.target.dataset.id;
      if (!action) return;
      if (action === "inc") changeQty(id, 1);
      if (action === "dec") changeQty(id, -1);
      if (action === "remove") removeItem(id);
    });

    document.getElementById("checkoutBtn").addEventListener("click", () => {
      alert(
        "Danke für deine Vorbestellung! Die Online-Zahlung ist noch im Aufbau. Wir melden uns per Mail, sobald die Kasse live ist."
      );
    });
  });
})();
