// Project-page back behavior.
// Reads ?from=map or ?from=archive and rewrites the project Back link.

(function () {
  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get("from");

  if (fromParam === "map" || fromParam === "archive") {
    sessionStorage.setItem("portfolioProjectOrigin", fromParam);
  }

  const origin = fromParam || sessionStorage.getItem("portfolioProjectOrigin") || "archive";

  const path = window.location.pathname;
  const marker = "/projects/";
  const markerIndex = path.indexOf(marker);

  // Works for GitHub Pages project URLs like:
  // /portfolio/projects/project-name/
  // and for local/custom-domain URLs like:
  // /projects/project-name/
  const siteBase = markerIndex >= 0 ? path.slice(0, markerIndex + 1) : "/";

  const targetHref = origin === "map"
    ? siteBase
    : `${siteBase}archive/`;

  const targetText = origin === "map"
    ? "← Back to map"
    : "← Back to archive";

  document.querySelectorAll(".back-link, [data-project-back]").forEach((link) => {
    link.setAttribute("href", targetHref);

    if (link.textContent.trim().startsWith("←") || link.textContent.trim().toLowerCase().includes("back")) {
      link.textContent = targetText;
    }
  });
})();
