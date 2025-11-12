import { fetchProductById } from './api.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const size = params.get('size') || '';

const box = document.querySelector('#cart-summary');

(async () => {
  try {
    if (!id) {
      box.textContent = 'Missing product id.';
      return;
    }
    const p = await fetchProductById(id);
    if (!p) {
      box.textContent = 'Product not found.';
      return;
    }

    // (Optional) store to localStorage as a real “cart”
    addToCart({ id: p.id, title: p.title, price: p.discountedPrice ?? p.price, size, qty: 1 });

    box.innerHTML = `
      <div class="cart-line">
        <img src="${p.image?.url || p.images?.[0]?.url || 'images/placeholder.jpg'}" alt="${p.title}">
        <div class="info">
          <strong>${p.title}</strong><br>
          ${size ? `Size: ${size}<br>` : ''}
          Price: £${p.discountedPrice ?? p.price}
        </div>
      </div>
    `;
  } catch (e) {
    console.error(e);
    box.textContent = 'Could not load product.';
  }
})();

function addToCart(item) {
  const key = 'cart';
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  current.push(item);
  localStorage.setItem(key, JSON.stringify(current));
}
