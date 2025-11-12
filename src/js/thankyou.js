// src/js/thankyou.js
import { fetchProductById } from './api.js';

const q = new URLSearchParams(location.search);
const order = q.get('order');
const id = q.get('id');
const size = q.get('size') || '';

const root = document.querySelector('.thankyou-summary');

(async () => {
  if (!order) {
    root.innerHTML = '<p>Mangler ordrenummer.</p>';
    return;
  }
  let product = null;
  if (id) {
    try { product = await fetchProductById(id); } catch {}
  }
  const img = product?.image?.url || product?.images?.[0]?.url || 'images/placeholder.jpg';
  const title = product?.title || 'Product';
  const price = product?.discountedPrice ?? product?.price ?? '';

  root.innerHTML = `
    <h1>Thank you!</h1>
    <p>Order number: <strong>${order}</strong></p>
    <div class="ty-card">
      <img src="${img}" alt="${title}">
      <div>
        <h3>${title}</h3>
        ${price !== '' ? `<p>Price: £${price}</p>` : ''}
        ${size ? `<p>Size: ${size}</p>` : ''}
        <a class="cta" href="index.html">Continue shopping</a>
      </div>
    </div>
  `;
})();
