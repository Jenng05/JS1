// src/js/cart-popup.js
import { fetchProductById } from './api.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const size = params.get('size') || '';

const root = document.querySelector('.cart-content');

(async () => {
  if (!id) {
    root.innerHTML = '<p>No product choosen.</p>';
    return;
  }

  try {
    const product = await fetchProductById(id);
    if (!product) {
      root.innerHTML = '<p>Cannot find product.</p>';
      return;
    }

    const img = product.image?.url || product.images?.[0]?.url || 'images/placeholder.jpg';
    const price = product.discountedPrice ?? product.price ?? '';

    root.innerHTML = `
      <img src="${img}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p>Pris: £${price}</p>
      ${size ? `<p>Size: ${size}</p>` : ''}
      <button class="checkout-btn">Payment</button>
    `;
  } catch (err) {
    console.error(err);
    root.innerHTML = '<p>Cannot load product.</p>';
  }
})();
