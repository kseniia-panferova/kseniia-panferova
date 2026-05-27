// Main-page graph logic.
// It reads interests.js and projects.js and connects topics to project pages.

const interestData = typeof interests !== "undefined" && Array.isArray(interests) ? interests : [];
const projectData = typeof projects !== "undefined" && Array.isArray(projects) ? projects : [];

const graphRoot = document.getElementById("interest-graph");
const nodesRoot = document.getElementById("graph-nodes");
const linesRoot = document.getElementById("graph-lines");
const panelRoot = document.getElementById("interest-panel");

const projectBySlug = new Map(projectData.map((project) => [project.slug, project]));
const interestById = new Map(interestData.map((interest) => [interest.id, interest]));

function projectUrl(slug) {
  return `projects/${encodeURI(slug)}/`;
}

function getProjectList(interest) {
  return (interest.projectSlugs || [])
    .map((slug) => projectBySlug.get(slug))
    .filter(Boolean);
}

function drawLines() {
  if (!linesRoot) return;

  linesRoot.innerHTML = "";

  interestData.forEach((interest) => {
    const relatedIds = interest.relatedTo || [];

    relatedIds.forEach((targetId) => {
      const target = interestById.get(targetId);
      if (!target) return;

      // Draw each connection only once.
      if (interest.id > target.id) return;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", interest.x);
      line.setAttribute("y1", interest.y);
      line.setAttribute("x2", target.x);
      line.setAttribute("y2", target.y);
      line.setAttribute("class", "graph-line");

      linesRoot.appendChild(line);
    });
  });
}

function createNode(interest, index) {
  const button = document.createElement("button");
  button.className = `interest-node interest-node--${interest.size || "medium"}`;
  button.type = "button";
  button.dataset.interestId = interest.id;

  button.style.setProperty("--x", `${interest.x}%`);
  button.style.setProperty("--y", `${interest.y}%`);
  button.style.setProperty("--delay", `${index * -0.7}s`);
  button.style.setProperty("--float", `${9 + (index % 5) * 3}px`);

  const label = document.createElement("span");
  label.className = "interest-node-label";
  label.textContent = interest.title;

  button.appendChild(label);

  button.addEventListener("click", () => selectInterest(interest.id));

  return button;
}

function renderNodes() {
  if (!nodesRoot) return;

  nodesRoot.innerHTML = "";

  interestData.forEach((interest, index) => {
    nodesRoot.appendChild(createNode(interest, index));
  });
}

function selectInterest(id) {
  const interest = interestById.get(id);
  if (!interest || !panelRoot) return;

  document.querySelectorAll(".interest-node").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.interestId === id);
  });

  const relatedProjects = getProjectList(interest);

  const projectLinks = relatedProjects.length
    ? relatedProjects.map((project) => `
        <a class="panel-project" href="${projectUrl(project.slug)}">
          <span class="panel-project-year">${project.year}</span>
          <span class="panel-project-title">${project.title}</span>
        </a>
      `).join("")
    : `<p class="panel-note">No linked projects yet. Add project slugs in interests.js.</p>`;

  panelRoot.innerHTML = `
    <div class="panel-kicker">current interest</div>
    <h2>${interest.title}</h2>
    <p>${interest.description || ""}</p>
    <div class="panel-projects">
      <h3>Related projects</h3>
      ${projectLinks}
    </div>
  `;
}

function initGraph() {
  if (!graphRoot || !nodesRoot || !panelRoot) return;

  if (!interestData.length) {
    panelRoot.innerHTML = "<p class='panel-empty'>No interests found. Check interests.js.</p>";
    return;
  }

  drawLines();
  renderNodes();
  selectInterest(interestData[0].id);
}

initGraph();
