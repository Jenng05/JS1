// src/js/cart-popup.js
import { fetchProductById } from './api.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const size = params.get('size'); // kan være null/undefined
const root = document.querySelector('#cp-product');

(async () => {
  if (!id) {
    root.innerHTML = '<p>Mangler produkt-id. Gå tilbake og velg produkt.</p>';
    return;
  }
  try {
    const p = await fetchProductById(id);
    if (!p) {
      root.innerHTML = '<p>Fant ikke produkt.</p>';
      return;
    }

    const imgEl = document.querySelector('#cp-img');
    const titleEl = document.querySelector('#cp-title');
    const priceEl = document.querySelector('#cp-price');
    const sizeEl = document.querySelector('#cp-size');

    const img = p.image?.url || p.images?.[0]?.url || 'images/placeholder.jpg';
    if (imgEl) { imgEl.src = img; imgEl.alt = p.title || 'Product'; }
    if (titleEl) titleEl.textContent = p.title || 'Product';
    if (priceEl) priceEl.textContent = `£${p.discountedPrice ?? p.price ?? ''}`;
    if (sizeEl) sizeEl.textContent = size ? `Size: ${size}` : 'Size: not selected';

  } catch (err) {
    console.error(err);
    root.innerHTML = '<p>Kunne ikke laste produkt.</p>';
  }
})();
