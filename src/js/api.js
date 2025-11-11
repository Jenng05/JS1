
const API_URL = 'https://v2.api.noroff.dev/rainy-days';

const options = {
  method: 'GET',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmVubmd1MDUiLCJlbWFpbCI6Ikplbm5ndTA1MTgzQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzYyNzk1MjM4fQ.I9W7xiTYQ71fa0XFZGyYjePWHqnaEtGUdm23_AQYKt8`,
    'X-Noroff-API-Key': '2b0bd8be-1bbd-4aa8-ab43-567aae3fc719'
  }
};

let _cache = null;

export async function fetchProducts() {
  if (_cache) return _cache;
  const res = await fetch(API_URL, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  _cache = json?.data ?? [];
  return _cache;
}

export async function fetchProductById(id) {
  const all = await fetchProducts();
  return all.find(p => p.id === id) || null;
}

