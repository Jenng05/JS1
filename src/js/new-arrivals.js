// src/js/new-arrivals.js
import { fetchProducts } from './api.js';

const container =
  document.querySelector('.products') ||
  document.querySelector('.product-list');

init();

async function init() {
  if (!container) return;
  try {
    const products = await fetchProducts();
    container.innerHTML = products.map(cardHTML).join('');
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Kunne ikke laste produkter.</p>';
  }
}

function cardHTML(p) {
  const img =
    p.image?.url || p.images?.[0]?.url || 'images/placeholder.jpg';
  const price = p.discountedPrice ?? p.price ?? '';
  const title = p.title || 'Product';

  return `
    <div class="product product-info">
      <a href="product-detail.html?id=${encodeURIComponent(p.id)}">
        <img src="${img}" alt="${title}">
      </a>
      <p class="title">${title} <span class="price">£${price}</span></p>
      <p class="sizes-label">Sizes available:</p>
      <div class="size-buttons">
        ${['XS','S','M','L','XL'].map(s=>`<button class="size">${s}</button>`).join('')}
      </div>
    </div>
  `;
}
