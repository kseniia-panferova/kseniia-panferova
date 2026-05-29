// Dynamic force graph for the main page.
// Requires force-graph from index.html.
// Reads interests.js and projects.js.

const interestData = typeof interests !== "undefined" && Array.isArray(interests) ? interests : [];
const projectData = typeof projects !== "undefined" && Array.isArray(projects) ? projects : [];

const graphRoot = document.getElementById("interest-graph");
const panelRoot = document.getElementById("interest-panel");

const projectBySlug = new Map(projectData.map((project) => [project.slug, project]));
const interestById = new Map(interestData.map((interest) => [interest.id, interest]));

let graphInstance = null;
let selectedNode = null;

const sizeToValue = {
  small: 2.4,
  medium: 3.2,
  large: 4.2
};

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
      .map((link) => ({
        target: link.target,
        type: link.type || "context",
        label: link.label || ""
      }))
      .filter((link) => link.target && interestById.has(link.target));
  }

  if (Array.isArray(interest.relatedTo)) {
    return interest.relatedTo
      .map((target) => ({
        target,
        type: "context",
        label: ""
      }))
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

function getPanelConnections(interest) {
  const directLinks = normalizeLinks(interest);

  const reverseLinks = interestData
    .filter((other) => other.id !== interest.id)
    .flatMap((other) => {
      return normalizeLinks(other)
        .filter((link) => link.target === interest.id)
        .map((link) => ({
          target: other.id,
          type: link.type || "context",
          label: link.label || "",
          reverse: true
        }));
    });

  const byTarget = new Map();

  [...directLinks, ...reverseLinks].forEach((link) => {
    if (!byTarget.has(link.target)) {
      byTarget.set(link.target, link);
    }
  });

  return [...byTarget.values()];
}

function buildGraphData() {
  const nodes = interestData.map((interest, index) => ({
    id: interest.id,
    name: interest.title,
    title: interest.title,
    description: interest.description || "",
    size: interest.size || "medium",
    val: sizeToValue[interest.size] || sizeToValue.medium,
    projectSlugs: interest.projectSlugs || [],
    // Initial positions from interests.js, then the simulation can move them.
    x: (Number(interest.x) - 50) * 7,
    y: (Number(interest.y) - 50) * 4.5,
    color: index % 3 === 0 ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.78)"
  }));

  const uniqueLinks = new Map();

  interestData.forEach((source) => {
    normalizeLinks(source).forEach((link) => {
      const target = interestById.get(link.target);
      if (!target) return;

      const pairKey = [source.id, target.id].sort().join("__");

      if (!uniqueLinks.has(pairKey)) {
        uniqueLinks.set(pairKey, {
          source: source.id,
          target: target.id,
          type: link.type || "context",
          label: link.label || ""
        });
      }
    });
  });

  return {
    nodes,
    links: [...uniqueLinks.values()]
  };
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

function getNodeByInterestId(id) {
  if (!graphInstance) return null;

  const graphData = graphInstance.graphData();
  return graphData.nodes.find((node) => node.id === id) || null;
}

function setActiveGraphState(nodeId) {
  if (!graphRoot) return;

  graphRoot.dataset.selectedNode = nodeId || "";

  if (graphInstance) {
    graphInstance.refresh();
  }
}

function positionPanelNearNode(node) {
  if (!panelRoot || !graphRoot || !graphInstance || !node) return;

  panelRoot.classList.add("is-active");

  requestAnimationFrame(() => {
    const graphRect = graphRoot.getBoundingClientRect();
    const coords = graphInstance.graph2ScreenCoords(node.x, node.y);

    const panelRect = panelRoot.getBoundingClientRect();
    const margin = 16;

    let left = coords.x;
    left = Math.max(panelRect.width / 2 + margin, Math.min(left, graphRect.width - panelRect.width / 2 - margin));

    let top = coords.y - panelRect.height - 22;

    if (top < margin) {
      top = coords.y + 22;
    }

    if (top + panelRect.height > graphRect.height - margin) {
      top = graphRect.height - panelRect.height - margin;
    }

    panelRoot.style.left = `${left}px`;
    panelRoot.style.top = `${top}px`;
    panelRoot.style.transform = "translateX(-50%)";
  });
}

function openNode(node) {
  const interest = interestById.get(node.id);
  if (!interest || !panelRoot) return;

  selectedNode = node;
  setActiveGraphState(node.id);

  panelRoot.innerHTML = `
    <button class="panel-close" type="button" aria-label="Close">×</button>
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

  panelRoot.querySelector(".panel-close")?.addEventListener("click", (event) => {
    event.stopPropagation();
    closePanel();
  });

  panelRoot.querySelectorAll("[data-select-interest]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const nextNode = getNodeByInterestId(button.dataset.selectInterest);
      if (nextNode) {
        openNode(nextNode);
      }
    });
  });

  positionPanelNearNode(node);
}

function closePanel() {
  selectedNode = null;

  if (panelRoot) {
    panelRoot.classList.remove("is-active");
  }

  setActiveGraphState(null);
}

function isConnectedToSelected(node) {
  if (!selectedNode || !graphInstance) return false;

  const data = graphInstance.graphData();

  return data.links.some((link) => {
    const sourceId = typeof link.source === "object" ? link.source.id : link.source;
    const targetId = typeof link.target === "object" ? link.target.id : link.target;

    return (
      (sourceId === selectedNode.id && targetId === node.id) ||
      (targetId === selectedNode.id && sourceId === node.id)
    );
  });
}

function drawNode(node, ctx, globalScale) {
  const isSelected = selectedNode && selectedNode.id === node.id;
  const isLinked = isConnectedToSelected(node);

  const radius = isSelected ? 5.6 : Math.max(2.8, node.val);
  const label = node.name || "";
  const fontSize = Math.max(9, 13 / globalScale);

  ctx.beginPath();
  ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = isSelected
    ? "rgba(255,255,255,1)"
    : isLinked
      ? "rgba(255,255,255,0.90)"
      : node.color || "rgba(255,255,255,0.76)";
  ctx.fill();

  ctx.shadowColor = "rgba(255,255,255,0.25)";
  ctx.shadowBlur = isSelected ? 14 : isLinked ? 8 : 0;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = `${fontSize}px Inter, Arial, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = isSelected || isLinked
    ? "rgba(255,255,255,0.98)"
    : "rgba(255,255,255,0.78)";

  ctx.fillText(label, node.x + radius + 7, node.y);
}

function resizeGraph() {
  if (!graphInstance || !graphRoot) return;

  graphInstance
    .width(graphRoot.clientWidth)
    .height(graphRoot.clientHeight);

  if (selectedNode) {
    positionPanelNearNode(selectedNode);
  }
}

function initForceGraph() {
  if (!graphRoot || !panelRoot) return;

  if (typeof ForceGraph === "undefined") {
    graphRoot.innerHTML = "<p class='graph-error'>ForceGraph did not load. Check the CDN script in index.html.</p>";
    return;
  }

  if (!interestData.length) {
    graphRoot.innerHTML = "<p class='graph-error'>No interests found. Check interests.js.</p>";
    return;
  }

  const graphData = buildGraphData();

  graphInstance = ForceGraph()(graphRoot)
    .graphData(graphData)
    .backgroundColor("rgba(0,0,0,0)")
    .nodeId("id")
    .nodeLabel((node) => node.name)
    .nodeVal((node) => node.val)
    .nodeColor((node) => node.color)
    .linkColor((link) => {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;

      if (selectedNode && (sourceId === selectedNode.id || targetId === selectedNode.id)) {
        return "rgba(255,255,255,0.58)";
      }

      return "rgba(255,255,255,0.16)";
    })
    .linkWidth((link) => {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;

      return selectedNode && (sourceId === selectedNode.id || targetId === selectedNode.id) ? 1.4 : 0.8;
    })
    .linkDirectionalParticles(0)
    .cooldownTicks(140)
    .d3VelocityDecay(0.30)
    .nodeCanvasObject(drawNode)
    .onNodeClick((node) => {
      openNode(node);
    })
    .onBackgroundClick(() => {
      closePanel();
    });

  graphInstance.d3Force("charge").strength(-95);
  graphInstance.d3Force("link").distance(115);
  graphInstance.d3Force("center").strength(0.045);

  resizeGraph();

  // Start slightly zoomed out so labels have air around them.
  setTimeout(() => {
    graphInstance.zoom(0.92, 500);
  }, 300);

  window.addEventListener("resize", resizeGraph);
}

initForceGraph();
