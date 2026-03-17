// NGP RIDR — Leaflet map initializer
// Loaded only on pages with mapEnabled: true in front matter.
// Finds all .map-embed elements and initializes Leaflet maps from data attributes.

document.querySelectorAll(".map-embed").forEach((el) => {
  const lat = parseFloat(el.dataset.lat ?? 46.8);
  const lng = parseFloat(el.dataset.lng ?? -100.8);
  const zoom = parseInt(el.dataset.zoom ?? 6, 10);

  // L is the Leaflet global, loaded from CDN before this module runs
  const map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);
});
