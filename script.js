"use strict";

// Contoh nomor WhatsApp kedai — ganti dengan nomor asli saat dipakai.
const SHOP_WHATSAPP = "6281234567890";

const MENU = [
  { id: "espresso", name: "Espresso", desc: "Shot pekat dari biji Gayo, rasa cokelat hitam dan sedikit jeruk.", price: 15000, tag: "Klasik" },
  { id: "kopi-susu", name: "Kopi Susu Senja", desc: "Espresso, susu segar, gula aren. Menu paling laris sejak hari pertama.", price: 20000, tag: "Paling laris" },
  { id: "v60", name: "V60 Manual Brew", desc: "Seduh manual biji Toraja, diminum pelan-pelan. Tanya barista soal tasting notes-nya.", price: 25000, tag: "Manual" },
  { id: "kopi-tubruk", name: "Kopi Tubruk", desc: "Robusta Lampung diseduh cara lama. Kental, jujur, tanpa basa-basi.", price: 12000, tag: "Klasik" },
  { id: "matcha", name: "Matcha Latte", desc: "Buat yang lagi nggak mau kopi. Matcha asli, susu, sedikit madu.", price: 22000, tag: "Non-kopi" },
  { id: "pisang-goreng", name: "Pisang Goreng Madu", desc: "Teman wajib kopi sore. Digoreng dadakan, ditabur gula aren.", price: 15000, tag: "Camilan" },
];

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const menuGrid = document.getElementById("menu-grid");
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartList = document.getElementById("cart-list");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const orderButton = document.getElementById("order-button");

const cart = new Map(); // id -> qty

function renderMenu() {
  for (const item of MENU) {
    const card = document.createElement("article");
    card.className = "menu-card";
    const head = document.createElement("div");
    head.className = "menu-head";
    const title = document.createElement("h3");
    title.textContent = item.name;
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.tag;
    head.append(title, tag);
    const desc = document.createElement("p");
    desc.textContent = item.desc;
    const foot = document.createElement("div");
    foot.className = "menu-foot";
    const price = document.createElement("span");
    price.className = "menu-price";
    price.textContent = rupiah.format(item.price);
    const add = document.createElement("button");
    add.type = "button";
    add.className = "btn-add";
    add.textContent = "+ Keranjang";
    add.addEventListener("click", () => {
      cart.set(item.id, (cart.get(item.id) || 0) + 1);
      renderCart();
    });
    foot.append(price, add);
    card.append(head, desc, foot);
    menuGrid.appendChild(card);
  }
}

function renderCart() {
  const entries = [...cart.entries()];
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  cartCount.textContent = count;
  cartList.innerHTML = "";
  cartEmpty.style.display = entries.length ? "none" : "block";

  let total = 0;
  const lines = [];
  for (const [id, qty] of entries) {
    const item = MENU.find((m) => m.id === id);
    const subtotal = item.price * qty;
    total += subtotal;
    lines.push(item.name + " x" + qty + " — " + rupiah.format(subtotal));

    const li = document.createElement("li");
    li.className = "cart-item";
    const label = document.createElement("span");
    label.textContent = item.name + " x" + qty;
    const sub = document.createElement("span");
    sub.className = "cart-subtotal";
    sub.textContent = rupiah.format(subtotal);
    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "btn-minus";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Kurangi " + item.name);
    minus.addEventListener("click", () => {
      const next = (cart.get(id) || 0) - 1;
      if (next <= 0) cart.delete(id);
      else cart.set(id, next);
      renderCart();
    });
    li.append(label, sub, minus);
    cartList.appendChild(li);
  }

  cartTotal.textContent = rupiah.format(total);
  const message =
    "Halo Kopi Senja, saya mau pesan:\n" +
    lines.join("\n") +
    "\nTotal: " + rupiah.format(total);
  orderButton.href =
    "https://wa.me/" + SHOP_WHATSAPP + "?text=" + encodeURIComponent(message);
  orderButton.classList.toggle("btn-disabled", !entries.length);
}

cartButton.addEventListener("click", () => {
  cartPanel.hidden = !cartPanel.hidden;
});
cartClose.addEventListener("click", () => {
  cartPanel.hidden = true;
});

document.getElementById("year").textContent = new Date().getFullYear();
renderMenu();
renderCart();
