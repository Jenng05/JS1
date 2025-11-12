// src/js/api.js
const API_URL = 'https://v2.api.noroff.dev/rainy-days';

const options = {
  method: 'GET',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmVubmd1MDUiLCJlbWFpbCI6Ikplbm5ndTA1MTgzQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzYyNzk1MjM4fQ.I9W7xiTYQ71fa0XFZGyYjePWHqnaEtGUdm23_AQYKt8`,
    'X-Noroff-API-Key': '2b0bd8be-1bbd-4aa8-ab43-567aae3fc719'
  }
};

let _cache = null;

/** Hent alle produkter (bruker cache med mindre force=true) */
export async function fetchProducts(force = false) {
  if (!force && _cache) return _cache;
  const res = await fetch(API_URL, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  _cache = json?.data ?? [];
  return _cache;
}

/** Finn raskt i cache (kan være null) */
export function findProductInCache(id) {
  return (_cache || []).find(p => p.id === id) || null;
}

/** Hent ett produkt: cache -> direkte endpoint -> fallback til å hente alle */
export async function fetchProductById(id) {
  // 1) cache
  const hit = findProductInCache(id);
  if (hit) return hit;

  // 2) direkte endpoint (billig hvis backend støtter det)
  try {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, options);
    if (res.ok) {
      const json = await res.json();
      const p = json?.data ?? null;
      if (p) return p;
    }
  } catch (_) {
    // ignorer, faller tilbake til 3)
  }

  // 3) fallback: hent alle og finn
  const all = await fetchProducts(true);
  return findProductInCache(id);
}
