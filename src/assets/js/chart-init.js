// NGP RIDR — Chart.js initializer
// Loaded only on pages with chartEnabled: true in front matter.
// Finds all .chart-embed canvas elements and fetches their data from data-src.

document.querySelectorAll("canvas.chart-embed").forEach(async (canvas) => {
  const type = canvas.dataset.chartType ?? "bar";
  const src = canvas.dataset.src;

  if (!src) {
    console.warn("chart-init: no data-src on", canvas.id);
    return;
  }

  try {
    const response = await fetch(src);
    const chartData = await response.json();

    // Chart is the Chart.js global, loaded from CDN before this module runs
    new Chart(canvas, {
      type,
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      },
    });
  } catch (err) {
    console.error("chart-init: failed to load chart data from", src, err);
  }
});
