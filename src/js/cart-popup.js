// src/js/cart-popup.js
import { fetchProductById } from './api.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const size = params.get('size') || '';

const root = document.querySelector('.cart-content');

(async () => {
  if (!id) {
    if (root) root.innerHTML = '<p>Ingen produkt valgt.</p>';
    return;
  }

  try {
    const product = await fetchProductById(id);
    if (!product) {
      root.innerHTML = '<p>Fant ikke produkt.</p>';
      return;
    }

    const img = product.image?.url || product.images?.[0]?.url || 'images/placeholder.jpg';
    const price = product.discountedPrice ?? product.price ?? '';

    root.innerHTML = `
      <img src="${img}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p>Pris: £${price}</p>
      ${size ? `<p>Størrelse: ${size}</p>` : ''}

      <div class="cart-actions">
        <a class="btn btn-primary"
           href="checkout.html?id=${encodeURIComponent(product.id)}${size ? `&size=${encodeURIComponent(size)}` : ''}">
          Go to Payment
        </a>

        <a class="btn btn-ghost" href="#" id="continue-shopping">
          Continue Shopping
        </a>
      </div>
    `;

    // "Fortsett å handle" sender brukeren tilbake til forrige side
    document.getElementById('continue-shopping')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (history.length > 1) history.back();
      else window.location.href = 'new-arrivals.html';
    });

  } catch (err) {
    console.error(err);
    root.innerHTML = '<p>Kunne ikke laste produkt.</p>';
  }
})();


// antatt at du allerede har id, title, price, size, img osv.
root.innerHTML = `
  <img src="${img}" alt="${title}">
  <h2>${title}</h2>
  <p>Pris: £${price}</p>
  <p>Størrelse: ${size || '—'}</p>

  <div class="cart-actions">
    <a class="btn btn-primary" href="checkout.html?id=${encodeURIComponent(id)}&size=${encodeURIComponent(size || '')}">
      Go to Payment
    </a>
    <a class="btn btn-outline" href="new-arrivals.html">
      Continue Shopping
    </a>
  </div>
`;
