const options = {
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmVubmd1MDUiLCJlbWFpbCI6Ikplbm5ndTA1MTgzQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzYyNzk1MjM4fQ.I9W7xiTYQ71fa0XFZGyYjePWHqnaEtGUdm23_AQYKt8`,
    "X-Noroff-API-Key": "2b0bd8be-1bbd-4aa8-ab43-567aae3fc719"
  },
  method: 'GET'
}
let items = [];


fetch('https://v2.api.noroff.dev/rainy-days', options)
  .then(response => response.json())
  .then(json => {
    items = json.data;
    for (let index = 0; index < items.length; index++) {
        console.log(items[index].title)
        
    }
  })
  .catch(error => console.error(error));

console.log('main.js loaded ✅');

