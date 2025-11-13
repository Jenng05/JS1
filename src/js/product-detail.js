// src/js/product-detail.js
import { fetchProductById } from './api.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const root = document.querySelector('.product-detail');

if (!id) {
  root.innerHTML = '<p>No product selected. Go back and choose a jacket.</p>';
} else {
  load();
}

async function load() {
  try {
    const product = await fetchProductById(id);
    if (!product) {
      root.innerHTML = '<p>Product not found.</p>';
      return;
    }
    renderDetail(product);
  } catch (err) {
    console.error(err);
    root.innerHTML = '<p>Could not load product.</p>';
  }
}

function renderDetail(p) {
  // --- IMAGE ---
  const img = p.image?.url || p.images?.[0]?.url || 'images/placeholder.jpg';
  const imgEl = document.querySelector('#pd-img');
  imgEl.src = img;
  imgEl.alt = p.title;

  // --- TITLE + PRICE ---
  document.querySelector('#pd-title').textContent = p.title;
  document.querySelector('#pd-price').textContent =
    `£${p.discountedPrice ?? p.price}`;

  // --- DESCRIPTION ---
  const descEl = document.querySelector('#pd-desc');
  if (descEl) descEl.textContent = p.description || '';

  // --- SIZES ---
  const sizesWrap = document.querySelector('#pd-sizes');
  const sizes = makeSizes(id); // SAME availability as New Arrivals
  sizesWrap.innerHTML = sizeButtonsHTML(sizes);

  // add click behavior
  sizesWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button.size');
    if (!btn || btn.disabled) return;

    sizesWrap.querySelectorAll('.size.is-selected')
      .forEach(b => b.classList.remove('is-selected'));

    btn.classList.add('is-selected');
    updateAddToCartHref();
  });

  // initialize Add-to-Cart link
  updateAddToCartHref();
}

function updateAddToCartHref() {
  const add = document.querySelector('#pd-add');
  if (!add) return;

  const selected = document.querySelector('#pd-sizes .size.is-selected');
  const sizeParam = selected
    ? `&size=${encodeURIComponent(selected.textContent.trim())}`
    : '';

  add.href = `cart-popup.html?id=${encodeURIComponent(id)}${sizeParam}`;
}

/* ---------- Helpers ---------- */
function makeSizes(seed) {
  const list = ['XS', 'S', 'M', 'L', 'XL'];
  const offIndex = Math.abs(hash(seed)) % list.length;
  const defaultIndex = (offIndex + 3) % list.length;

  return list.map((label, i) => ({
    label,
    off: i === offIndex,
    selected: i === defaultIndex
  }));
}

function sizeButtonsHTML(sizes) {
  return sizes
    .map(
      (s) => `
      <button 
        class="size${s.selected ? ' is-selected' : ''}${s.off ? ' is-off' : ''}"
        ${s.off ? 'disabled' : ''}>
        ${s.label}
      </button>
    `
    )
    .join('');
}

function hash(str = 'x') {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return h;
}
