// Renders the project archive from projects.js.
// To add projects, edit projects.js only.

const projectTypeLabels = {
  A: "Architecture / research",
  S: "Spatial studies",
  C: "Competitions",
  W: "Work / professional"
};

const projectTypeOrder = ["A", "S", "C", "W"];

function projectUrl(slug) {
  return `../projects/${encodeURI(slug)}/`;
}

function coverUrl(cover) {
  return `../${cover}`;
}

function createProjectCard(project) {
  const link = document.createElement("a");
  link.className = "project-card";
  link.href = projectUrl(project.slug);

  const img = document.createElement("img");
  img.src = coverUrl(project.cover);
  img.alt = project.title;
  img.loading = "lazy";

  const meta = document.createElement("div");
  meta.className = "project-meta";

  const year = document.createElement("span");
  year.className = "project-year";
  year.textContent = project.year;

  const title = document.createElement("h2");
  title.textContent = project.title;

  meta.append(year, title);
  link.append(img, meta);

  return link;
}

function renderArchive() {
  const root = document.getElementById("projects-root");

  if (!root) return;

  if (typeof projects === "undefined" || !Array.isArray(projects)) {
    root.innerHTML = "<p class='archive-empty'>No projects found. Check projects.js.</p>";
    return;
  }

  root.innerHTML = "";

  const projectsByType = projects.reduce((acc, project) => {
    const type = project.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(project);
    return acc;
  }, {});

  const knownTypes = projectTypeOrder.filter((type) => projectsByType[type]);
  const unknownTypes = Object.keys(projectsByType).filter((type) => !projectTypeOrder.includes(type));
  const allTypes = [...knownTypes, ...unknownTypes];

  allTypes.forEach((type) => {
    const groupProjects = projectsByType[type]
      .slice()
      .sort((a, b) => Number(b.year) - Number(a.year));

    const section = document.createElement("section");
    section.className = "project-group";

    const heading = document.createElement("h2");
    heading.className = "project-group-title";
    heading.textContent = projectTypeLabels[type] || type;

    const grid = document.createElement("div");
    grid.className = "projects-grid";

    groupProjects.forEach((project) => {
      grid.appendChild(createProjectCard(project));
    });

    section.append(heading, grid);
    root.appendChild(section);
  });
}

renderArchive();
