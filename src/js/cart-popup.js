// src/js/cart-popup.js
import { fetchProductById } from "./api.js";

const params = new URLSearchParams(location.search);
const id = params.get("id");
const size = params.get("size") || "";

const root = document.querySelector(".cart-content");

(async function init() {
  if (!root) return;

  if (!id) {
    root.innerHTML = "<p>No product selected</p>";
    return;
  }

  // Liten "loading" så brukeren ser at noe skjer
   if (root) {
    root.innerHTML = '<p class="loading">Loading your cart…</p>';
  }

  try {
    const product = await fetchProductById(id);
    if (!product) {
      root.innerHTML = "<p>Fant ikke produkt.</p>";
      return;
    }

    const img =
      product.image?.url ||
      product.images?.[0]?.url ||
      "images/placeholder.jpg";
    const price = product.discountedPrice ?? product.price ?? "";
    const title = product.title || "Product";

    root.innerHTML = `
      <img src="${img}" alt="${title}">
      <h2>${title}</h2>
      <p>Pris: £${price}</p>
      ${size ? `<p>Størrelse: ${size}</p>` : ""}

      <div class="cart-actions">
        <a class="btn btn-primary"
           href="checkout.html?id=${encodeURIComponent(
             product.id
           )}${size ? `&size=${encodeURIComponent(size)}` : ""}">
          Go to Payment
        </a>

        <button class="btn btn-ghost" id="continue-shopping">
          Continue Shopping
        </button>
      </div>
    `;

    // "Fortsett å handle" → tilbake til forrige side eller New Arrivals
    const contBtn = document.getElementById("continue-shopping");
    if (contBtn) {
      contBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (history.length > 1) {
          history.back();
        } else {
          window.location.href = "new-arrivals.html";
        }
      });
    }
  } catch (err) {
    console.error(err);
    root.innerHTML = "<p>Kunne ikke laste produkt.</p>";
  }
})();
