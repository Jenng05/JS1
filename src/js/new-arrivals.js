import { fetchProducts } from './api.js';

const container =
  document.querySelector('.products') ||
  document.querySelector('.product-list');

init();

async function init() {
  if (!container) return;

  // Loading-tekst mens vi venter på API
  container.innerHTML = '<p class="loading">Loading products…</p>';

  try {
    const products = await fetchProducts();
    container.innerHTML = products.map(cardHTML).join('');
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Could not load products. Please try again.</p>';
  }
}

function cardHTML(p) {
  const img = p.image?.url || p.images?.[0]?.url || 'images/placeholder.jpg';
  const price = p.discountedPrice ?? p.price ?? '';
  const title = p.title || 'Product';

  // samme availability som på Product Detail (based on product id)
  const sizes = makeSizes(p.id);

  return `
    <div class="product product-info">
      <a href="product-detail.html?id=${encodeURIComponent(p.id)}">
        <img src="${img}" alt="${title}">
      </a>
      <p class="title">${title} <span class="price">£${price}</span></p>
      <p class="sizes-label">Sizes available:</p>
      ${sizeButtonsHTML(sizes)}
    </div>
  `;
}

/* ---------- samme helpers as Product Detail ---------- */
function makeSizes(seed) {
  const list = ['XS', 'S', 'M', 'L', 'XL'];
  const offIndex = Math.abs(hash(String(seed))) % list.length;
  const defaultIndex = (offIndex + 3) % list.length;
  return list.map((label, i) => ({
    label,
    off: i === offIndex,
    selected: i === defaultIndex,
  }));
}

function sizeButtonsHTML(sizes) {
  // Non-interactive on the cards
  return `
    <div class="size-buttons">
      ${sizes
        .map(
          (s) => `
        <button
          class="size${s.selected ? ' is-selected' : ''}${s.off ? ' is-off' : ''}"
          ${s.off ? 'disabled' : ''}
          tabindex="-1"
          aria-disabled="true">
          ${s.label}
        </button>
      `
        )
        .join('')}
    </div>
  `;
}

function hash(s = 'x') {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
