// NGP RIDR — site-wide JavaScript
// Loaded as a module on every page.

// Mark current nav link active based on URL
document.querySelectorAll(".site-nav a").forEach((link) => {
  if (link.getAttribute("href") !== "/" && location.pathname.startsWith(link.getAttribute("href"))) {
    link.setAttribute("aria-current", "page");
  }
});
