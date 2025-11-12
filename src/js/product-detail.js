import { fetchProductById } from './api.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const root = document.querySelector('.product-detail');

if (!id) {
  if (root) root.innerHTML = '<p>Ingen produkt-id. Gå via New Arrivals og klikk på et produkt.</p>';
} else {
  (async () => {
    try {
      const p = await fetchProductById(id);
      if (!p) {
        root.innerHTML = '<p>Fant ikke produkt.</p>';
        return;
      }
      renderDetail(p);
    } catch (err) {
      console.error(err);
      root.innerHTML = '<p>Kunne ikke laste produkt.</p>';
    }
  })();
}

function renderDetail(p) {
  // Image
  const imgEl = document.querySelector('.product-image img, #pd-img');
  const img = p.image?.url || p.images?.[0]?.url || 'images/placeholder.jpg';
  if (imgEl) {
    imgEl.src = img;
    imgEl.alt = p.title || 'Product';
  }

  // Title + price
  const titleEl = document.querySelector('.product-title, #pd-title');
  if (titleEl) titleEl.textContent = p.title || 'Product';

  const priceEl = document.querySelector('.highlight_price, #pd-price');
  if (priceEl) priceEl.textContent = `£${p.discountedPrice ?? p.price ?? ''}`;

  // Description
  const descEl = document.querySelector('#pd-desc');
  if (descEl) descEl.textContent = p.description || p.descriptionShort || '';

  // Sizes
  const sizesWrap = document.querySelector('#pd-sizes');
  if (sizesWrap) {
    const sizes = makeSizes(p.id || id);
    sizesWrap.innerHTML = sizeButtonsHTML(sizes);

    sizesWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('button.size');
      if (!btn || btn.disabled) return;
      sizesWrap.querySelectorAll('.size.is-selected').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      updateAddToCartHref();
    });
  }

  // Ensure Add-to-cart link has id (& selected size if any)
  updateAddToCartHref();

  function updateAddToCartHref() {
    const add = document.querySelector('#pd-add');
    if (!add) return;
    const selected = document.querySelector('#pd-sizes .size.is-selected');
    const sizeParam = selected ? `&size=${encodeURIComponent(selected.textContent.trim())}` : '';
    add.href = `cart-popup.html?id=${encodeURIComponent(p.id || id)}${sizeParam}`;
  }
}

/* ---------- helpers ---------- */
function makeSizes(seed) {
  const list = ['XS','S','M','L','XL'];
  const offIndex = Math.abs(hash(String(seed))) % list.length;
  const defaultIndex = (offIndex + 3) % list.length;
  return list.map((label, i) => ({
    label,
    off: i === offIndex,
    selected: i === defaultIndex
  }));
}

function sizeButtonsHTML(sizes) {
  return `
    <div class="size-buttons">
      ${sizes.map(s => `
        <button
          class="size${s.selected ? ' is-selected' : ''}${s.off ? ' is-off' : ''}"
          ${s.off ? 'disabled' : ''}>
          ${s.label}
        </button>
      `).join('')}
    </div>
  `;
}

function hash(s='x'){ let h=0; for (let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i))|0; return h; }
