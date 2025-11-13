// src/js/checkout.js
import { fetchProductById } from './api.js';

const q = new URLSearchParams(location.search);
const id = q.get('id');
const size = q.get('size') || '';

const summary = document.getElementById('co-summary');
const form = document.getElementById('co-form');

init();

async function init() {
  if (!id) {
    if (summary) summary.innerHTML = '<p>No product in checkout. Go back and add one.</p>';
    return;
  }

    if (summary) {
    summary.innerHTML = '<p class="loading">Loading order summary…</p>';
  }


  try {
    const p = await fetchProductById(id);
    renderSummary(p, size);
    wireValidation();
    wireFormatting();
  } catch (e) {
    console.error(e);
    if (summary) summary.innerHTML = '<p>Could not load product..</p>';
  }
}

function renderSummary(p, chosenSize) {
  if (!summary) return;
  const img = p.image?.url || p.images?.[0]?.url || 'images/placeholder.jpg';
  const price = p.discountedPrice ?? p.price ?? '';
  const title = p.title || 'Product';

  summary.innerHTML = `
    <div class="heading-summary">
      <h3>Order summary</h3>
      <button type="button" class="edit-button" onclick="history.back()">Edit</button>
    </div>
    <hr class="checkout-hr" />

    <div class="order-information">
      <img src="${img}" alt="${title}">
      <div class="order-summary-info">
        <h4>${title}</h4>

        <div class="summary-text-price">
          <h4>Price <span>£${price}</span></h4>
          <h4>Size <span>${chosenSize || '—'}</span></h4>
        </div>
      </div>
    </div>
  `;
}

function wireValidation() {
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = [
      ['name', v => v.trim().length > 1],
      ['email', v => /\S+@\S+\.\S+/.test(v)],
      ['address', v => v.trim().length > 3],
      ['city', v => v.trim().length > 1],
      ['zip', v => /^[0-9A-Za-z -]{3,10}$/.test(v)],
      ['cardName', v => v.trim().length > 1],
      ['cardNumber', v => /^[0-9 ]{12,19}$/.test(v.replaceAll('-', ' ').trim())],
      ['expiry', v => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim())],
      ['cvv', v => /^\d{3,4}$/.test(v.trim())],
    ];

    let ok = true;
    fields.forEach(([id, test]) => {
      const el = document.getElementById(id);
      const valid = test(el.value);
      el.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });

    if (!ok) return;

    // “Send” ordren → thankyou.html
    const orderNo = 'RD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const params = new URLSearchParams({
      order: orderNo,
      id,
      size
    });
    location.href = `thankyou.html?${params.toString()}`;
  });
}

/* Optional input helpers (formatting) */
function wireFormatting() {
  const number = document.getElementById('cardNumber');
  const expiry = document.getElementById('expiry');
  const cvv = document.getElementById('cvv');

  if (number) {
    number.addEventListener('input', () => {
      let v = number.value.replace(/\D/g, '').slice(0, 16);
      v = v.replace(/(.{4})/g, '$1 ').trim();
      number.value = v;
    });
  }

  if (expiry) {
    expiry.addEventListener('input', () => {
      let v = expiry.value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
      expiry.value = v;
    });
  }

  if (cvv) {
    cvv.addEventListener('input', () => {
      cvv.value = cvv.value.replace(/\D/g, '').slice(0, 4);
    });
  }
}
