import { fetchProducts } from './api.js';

const container = document.querySelector('.products');
if (container) {
  (async () => {
    try {
      const all = await fetchProducts();
      const four = all.slice(0, 4);
      container.innerHTML = four.map(cardHTML).join('');
    } catch (e) {
      container.innerHTML = '<p>Could not load product.</p>';
      console.error(e);
    }
  })();
}

function cardHTML(p) {
  const img = p.image?.url || p.images?.[0]?.url || 'images/placeholder.jpg';
  const price = p.price || p.discountedPrice || '';

  // Link til detaljside med id i query
  return `
    <div class="product">
      <a href="product-detail.html?id=${encodeURIComponent(p.id)}">
        <img src="${img}" alt="${p.title || 'Product'}" />
      </a>
      <p class="title">${p.title || 'Product'} <span class="price">£${price}</span></p>
      <p class="sizes-label">Sizes available:</p>
      ${sizeButtonsHTML(p.id)}
    </div>
  `;
}

// Enkel “variasjon” i tilgjengelighet basert på id
function sizeButtonsHTML(seed) {
  const list = ['XS','S','M','L','XL'];
  const offIndex = Math.abs(hash(seed)) % list.length;
  return `
    <div class="size-buttons">
      ${list.map((s, i) => {
        const off = i === offIndex ? ' is-off" disabled' : '"';
        return `<button class="size${off}>${s}</button>`;
      }).join('')}
    </div>
  `;
}
function hash(s='x'){ let h=0; for (let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i))|0; return h; }
