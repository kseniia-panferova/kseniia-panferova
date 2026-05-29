// Full-width static interest graph.
// It reads interests.js and projects.js.
// The info card appears near the selected point instead of living in a side column.

const interestData = typeof interests !== "undefined" && Array.isArray(interests) ? interests : [];
const projectData = typeof projects !== "undefined" && Array.isArray(projects) ? projects : [];

const graphRoot = document.getElementById("interest-graph");
const nodesRoot = document.getElementById("graph-nodes");
const linesRoot = document.getElementById("graph-lines");
const panelRoot = document.getElementById("interest-panel");
const layoutRoot = document.querySelector(".interest-layout");

const projectBySlug = new Map(projectData.map((project) => [project.slug, project]));
const interestById = new Map(interestData.map((interest) => [interest.id, interest]));

let selectedInterestId = null;

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function projectUrl(slug) {
  return `projects/${encodeURI(slug)}/`;
}

function normalizeLinks(interest) {
  if (Array.isArray(interest.links)) {
    return interest.links
      .map((link) => ({ target: link.target, type: link.type || "context", label: link.label || "" }))
      .filter((link) => link.target && interestById.has(link.target));
  }

  if (Array.isArray(interest.relatedTo)) {
    return interest.relatedTo
      .map((target) => ({ target, type: "context", label: "" }))
      .filter((link) => link.target && interestById.has(link.target));
  }

  return [];
}

function getProjectList(interest) {
  return (interest.projectSlugs || [])
    .map((slug) => projectBySlug.get(slug))
    .filter(Boolean);
}

function getSharedProjects(firstInterest, secondInterest) {
  const firstSlugs = new Set(firstInterest.projectSlugs || []);
  const secondSlugs = new Set(secondInterest.projectSlugs || []);

  return [...firstSlugs]
    .filter((slug) => secondSlugs.has(slug))
    .map((slug) => projectBySlug.get(slug))
    .filter(Boolean);
}

function getAllUniqueLinks() {
  const unique = new Map();

  interestData.forEach((source) => {
    normalizeLinks(source).forEach((link) => {
      const target = interestById.get(link.target);
      if (!target) return;

      const pairKey = [source.id, target.id].sort().join("__");

      if (!unique.has(pairKey)) {
        unique.set(pairKey, {
          source: source.id,
          target: target.id,
          type: link.type || "context",
          label: link.label || ""
        });
      }
    });
  });

  return [...unique.values()];
}

function drawLines() {
  if (!linesRoot) return;

  linesRoot.innerHTML = "";

  getAllUniqueLinks().forEach((link) => {
    const source = interestById.get(link.source);
    const target = interestById.get(link.target);

    if (!source || !target) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", source.x);
    line.setAttribute("y1", source.y);
    line.setAttribute("x2", target.x);
    line.setAttribute("y2", target.y);
    line.setAttribute("class", `graph-line graph-line--${link.type}`);
    line.dataset.source = source.id;
    line.dataset.target = target.id;
    line.dataset.type = link.type;

    linesRoot.appendChild(line);
  });
}

function createNode(interest) {
  const button = document.createElement("button");
  button.className = `interest-node interest-node--${interest.size || "medium"}`;
  button.type = "button";
  button.dataset.interestId = interest.id;
  button.setAttribute("aria-label", interest.title);

  button.style.setProperty("--x", `${interest.x}%`);
  button.style.setProperty("--y", `${interest.y}%`);

  const label = document.createElement("span");
  label.className = "interest-node-label";
  label.textContent = interest.title;

  button.appendChild(label);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    selectInterest(interest.id);
  });

  return button;
}

function renderNodes() {
  if (!nodesRoot) return;
  nodesRoot.innerHTML = "";
  interestData.forEach((interest) => nodesRoot.appendChild(createNode(interest)));
}

function isInterestLinked(sourceId, targetId) {
  if (!sourceId || !targetId || sourceId === targetId) return false;

  const source = interestById.get(sourceId);
  const target = interestById.get(targetId);
  if (!source || !target) return false;

  const sourceLinks = normalizeLinks(source).some((link) => link.target === targetId);
  const targetLinks = normalizeLinks(target).some((link) => link.target === sourceId);

  return sourceLinks || targetLinks;
}

function setActiveGraphState(selectedId) {
  document.querySelectorAll(".interest-node").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.interestId === selectedId);
    node.classList.toggle("is-linked", isInterestLinked(selectedId, node.dataset.interestId));
  });

  document.querySelectorAll(".graph-line").forEach((line) => {
    const isActive = line.dataset.source === selectedId || line.dataset.target === selectedId;
    line.classList.toggle("is-active", isActive);
  });
}

function getPanelConnections(interest) {
  const directLinks = normalizeLinks(interest);

  const reverseLinks = interestData
    .filter((other) => other.id !== interest.id)
    .flatMap((other) => {
      return normalizeLinks(other)
        .filter((link) => link.target === interest.id)
        .map((link) => ({ target: other.id, type: link.type || "context", label: link.label || "", reverse: true }));
    });

  const byTarget = new Map();
  [...directLinks, ...reverseLinks].forEach((link) => {
    if (!byTarget.has(link.target)) byTarget.set(link.target, link);
  });

  return [...byTarget.values()];
}

function renderConnections(interest) {
  const connections = getPanelConnections(interest);

  if (!connections.length) {
    return `<p class="panel-note">No conceptual links yet. Add links in interests.js.</p>`;
  }

  return connections.map((link) => {
    const target = interestById.get(link.target);
    if (!target) return "";

    const sharedProjects = getSharedProjects(interest, target);
    const sharedText = sharedProjects.length
      ? `
        <div class="panel-shared-projects">
          shared through:
          ${sharedProjects.map((project) => escapeHTML(project.title)).join(", ")}
        </div>
      `
      : "";

    return `
      <button class="panel-connection" type="button" data-select-interest="${escapeHTML(target.id)}">
        <span class="panel-connection-title">${escapeHTML(target.title)}</span>
        <span class="panel-connection-type">${escapeHTML(link.type)}</span>
        <span class="panel-connection-label">${escapeHTML(link.label || "Connected interest")}</span>
        ${sharedText}
      </button>
    `;
  }).join("");
}

function renderProjects(interest) {
  const relatedProjects = getProjectList(interest);

  if (!relatedProjects.length) {
    return `<p class="panel-note">No linked projects yet. Add project slugs in interests.js.</p>`;
  }

  return relatedProjects.map((project) => `
    <a class="panel-project" href="${projectUrl(project.slug)}">
      <span class="panel-project-year">${escapeHTML(project.year)}</span>
      <span class="panel-project-title">${escapeHTML(project.title)}</span>
    </a>
  `).join("");
}

function positionPanelNearInterest(interest) {
  if (!panelRoot || !graphRoot || !layoutRoot) return;

  const graphRect = graphRoot.getBoundingClientRect();
  const layoutRect = layoutRoot.getBoundingClientRect();

  const pointX = (interest.x / 100) * graphRect.width + (graphRect.left - layoutRect.left);
  const pointY = (interest.y / 100) * graphRect.height + (graphRect.top - layoutRect.top);

  panelRoot.classList.add("is-active");

  requestAnimationFrame(() => {
    const panelRect = panelRoot.getBoundingClientRect();
    const graphWidth = graphRect.width;
    const graphHeight = graphRect.height;
    const margin = 16;
    const panelWidth = panelRect.width;
    const panelHeight = panelRect.height;

    let left = pointX;
    left = Math.max(panelWidth / 2 + margin, Math.min(left, graphWidth - panelWidth / 2 - margin));

    let top = pointY - panelHeight - 18;
    if (top < margin) top = pointY + 18;
    if (top + panelHeight > graphHeight - margin) top = graphHeight - panelHeight - margin;

    panelRoot.style.left = `${left}px`;
    panelRoot.style.top = `${top}px`;
    panelRoot.style.transform = "translateX(-50%)";
  });
}

function selectInterest(id) {
  const interest = interestById.get(id);
  if (!interest || !panelRoot) return;

  selectedInterestId = id;
  setActiveGraphState(id);

  panelRoot.innerHTML = `
    <div class="panel-kicker">current interest</div>
    <h2>${escapeHTML(interest.title)}</h2>
    <p>${escapeHTML(interest.description || "")}</p>

    <div class="panel-connections">
      <h3>Connected interests</h3>
      ${renderConnections(interest)}
    </div>

    <div class="panel-projects">
      <h3>Related projects</h3>
      ${renderProjects(interest)}
    </div>
  `;

  panelRoot.querySelectorAll("[data-select-interest]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectInterest(button.dataset.selectInterest);
    });
  });

  positionPanelNearInterest(interest);
}

function hidePanel() {
  selectedInterestId = null;
  if (panelRoot) panelRoot.classList.remove("is-active");
  setActiveGraphState(null);
}

function initGraph() {
  if (!graphRoot || !nodesRoot || !panelRoot) return;

  if (!interestData.length) {
    panelRoot.innerHTML = "<p class='panel-empty'>No interests found. Check interests.js.</p>";
    panelRoot.classList.add("is-active");
    return;
  }

  drawLines();
  renderNodes();

  graphRoot.addEventListener("click", () => hidePanel());

  window.addEventListener("resize", () => {
    if (!selectedInterestId) return;
    const interest = interestById.get(selectedInterestId);
    if (interest) positionPanelNearInterest(interest);
  });
}

initGraph();
