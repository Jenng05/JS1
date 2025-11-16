const API_BASE = 'https://v2.api.noroff.dev';
const API_PATH = '/rainy-days';

const options = {
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmVubmd1MDUiLCJlbWFpbCI6Ikplbm5ndTA1MTgzQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzYyNzk1MjM4fQ.I9W7xiTYQ71fa0XFZGyYjePWHqnaEtGUdm23_AQYKt8`,
    "X-Noroff-API-Key": "2b0bd8be-1bbd-4aa8-ab43-567aae3fc719"
  },
  method: 'GET'
};

async function fetchJSON(url) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json?.data ?? json;
}

// Liten "fake"-funksjon for størrelser (inntil API har ekte sizes)
function getSizeAvailability(seedText = '') {
  // Vi markerer noen som utsolgt basert på en enkel hash
  const sizes = ['XS','S','M','L','XL'];
  const hash = [...seedText].reduce((a,c)=>a+c.charCodeAt(0),0);
  const offIndex = hash % sizes.length;       // én tom
  const selectedIndex = (hash + 2) % sizes.length; // én valgt
  return sizes.map((s, i) => ({
    label: s,
    off: i === offIndex,
    selected: i === selectedIndex && i !== offIndex
  }));
}


