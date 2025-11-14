// src/js/thankyou.js
import { fetchProductById } from './api.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');      // produkt-id fra checkout
const order = params.get('order'); // ordrenummer
const size = params.get('size') || '';

const root = document.getElementById('ty-root');

// Hvis vi ikke finner root, avslutt stille så vi slipper feil i konsollen
if (!root) {
  console.warn('Fant ikke #ty-root på thankyou.html');
} else {
  (async () => {
    try {
      let product = null;

      if (id) {
        // hent produktet slik at vi kan vise navn/bilde osv
        product = await fetchProductById(id);
      }

      const title = product?.title || 'your item';
      const img =
        product?.image?.url || product?.images?.[0]?.url || 'images/placeholder.jpg';

      root.innerHTML = `
        <div class="thankyou-wrapper">
          <h1>Thank you for your order!</h1>

          ${order ? `<p>Your order number is <strong>${order}</strong>.</p>` : ''}

          <div class="thankyou-product">
            <img src="${img}" alt="${title}">
            <div>
              <h2>${title}</h2>
              ${size ? `<p>Size: ${size}</p>` : ''}
            </div>
          </div>

          <p>You will receive a confirmation email shortly.</p>

          <a href="index.html" class="btn btn-primary">Back to home</a>
        </div>
      `;
    } catch (err) {
      console.error(err);
      root.innerHTML = '<p>Sorry, something went wrong loading your order.</p>';
    }
  })();
}
