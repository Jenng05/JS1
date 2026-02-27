import { fetchProductById } from "./api.js";

const params = new URLSearchParams(location.search);
const id = params.get("id");
const size = params.get("size") || "";

const root = document.querySelector(".cart-content");

function getImage(product) {
  return product.image?.url || product.images?.[0]?.url || "images/placeholder.jpg";
}

function goBackOrFallback() {
  if (history.length > 1) history.back();
  else window.location.href = "new-arrivals.html";
}

(async function init() {
  if (!root) return;

  if (!id) {
    root.innerHTML = "<p>No product selected.</p>";
    return;
  }

  // Liten "loading" så brukeren ser at noe skjer
  root.innerHTML = '<p class="loading">Loading your cart…</p>';

  try {
    const product = await fetchProductById(id);
    if (!product) {
      root.innerHTML = "<p>Could not load product.</p>";
      return;
    }

    const img = getImage(product);
    const price = product.discountedPrice ?? product.price ?? "";
    const title = product.title || "Product";

    const checkoutLink =
      `checkout.html?id=${encodeURIComponent(product.id)}` +
      (size ? `&size=${encodeURIComponent(size)}` : "");

    root.innerHTML = `
      <img src="${img}" alt="${title}">
      <h2>${title}</h2>
      <p>Price: £${price}</p>
      ${size ? `<p>Size: ${size}</p>` : ""}

      <div class="cart-actions">
        <a class="btn btn-primary" href="${checkoutLink}">
          Go to Payment
        </a>

        <button class="btn btn-ghost" id="continue-shopping">
          Continue Shopping
        </button>
      </div>
    `;

    // "Fortsett å handle" tilbake til forrige side
    document.getElementById("continue-shopping")?.addEventListener("click", (e) => {
      e.preventDefault();
      goBackOrFallback();
    });
  } catch (err) {
    console.error(err);
    root.innerHTML = "<p>could not load product.</p>";
  }
})();
