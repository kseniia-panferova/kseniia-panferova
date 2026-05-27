// Main-page interest map.
// Edit this file when you want to add, remove or rename nodes.
//
// x and y are percentages of the graph area.
// projectSlugs must match the slug values from projects.js.

const interests = [
  {
    id: "landscape-systems",
    title: "landscape systems",
    description: "Territories as layered ecological, cultural and infrastructural systems.",
    x: 18,
    y: 28,
    size: "large",
    relatedTo: ["mapping", "ecology", "public-space"],
    projectSlugs: [
      "2021_A_Rybinskoye Reservoir",
      "2022_C_Devinska_Kobyla",
      "2024_S_Factory_Reset"
    ]
  },
  {
    id: "mapping",
    title: "mapping / counter-mapping",
    description: "Drawing as a way to read space, reveal hidden relations and build spatial arguments.",
    x: 42,
    y: 18,
    size: "medium",
    relatedTo: ["landscape-systems", "infrastructure", "archive-memory"],
    projectSlugs: [
      "2024_S_Factory_Reset",
      "2021_W_Pavlovskaya_27",
      "2020_W_Varshavskoye_Highway_141"
    ]
  },
  {
    id: "archive-memory",
    title: "archive / memory",
    description: "Traces, fragments, documents and remembered forms as material for spatial research.",
    x: 70,
    y: 30,
    size: "large",
    relatedTo: ["mapping", "post-industrial", "exhibition"],
    projectSlugs: [
      "2023_A_Factory_of_Nothing_Tapes",
      "2023_A_No_Soup_Exhibition",
      "2023_С_Last_Glow"
    ]
  },
  {
    id: "post-industrial",
    title: "post-industrial landscapes",
    description: "Ruins, exhausted territories, production afterlives and ambiguous urban edges.",
    x: 30,
    y: 55,
    size: "large",
    relatedTo: ["archive-memory", "infrastructure", "landscape-systems"],
    projectSlugs: [
      "2021_W_Pavlovskaya_27",
      "2020_W_Varshavskoye_Highway_141",
      "2024_S_Factory_Reset"
    ]
  },
  {
    id: "infrastructure",
    title: "infrastructure",
    description: "Visible and invisible systems that organize everyday space.",
    x: 56,
    y: 57,
    size: "medium",
    relatedTo: ["mapping", "post-industrial", "public-space"],
    projectSlugs: [
      "2020_W_Varshavskoye_Highway_141",
      "2024_S_Factory_Reset"
    ]
  },
  {
    id: "exhibition",
    title: "exhibition as medium",
    description: "Exhibition, model and display as tools for producing spatial narratives.",
    x: 80,
    y: 62,
    size: "medium",
    relatedTo: ["archive-memory", "fiction"],
    projectSlugs: [
      "2024_A_Exhibition_Model",
      "2023_A_No_Soup_Exhibition",
      "2023_A_Factory_of_Nothing_Tapes"
    ]
  },
  {
    id: "public-space",
    title: "public space",
    description: "Shared environments, urban rituals, accessibility and everyday negotiations.",
    x: 22,
    y: 78,
    size: "medium",
    relatedTo: ["landscape-systems", "infrastructure", "ecology"],
    projectSlugs: [
      "2017_S_Navi_Pavilion",
      "2021_W_Pavlovskaya_27"
    ]
  },
  {
    id: "ecology",
    title: "ecological thinking",
    description: "Design processes that begin with observation, care, adaptation and long-term relations.",
    x: 52,
    y: 82,
    size: "large",
    relatedTo: ["landscape-systems", "public-space"],
    projectSlugs: [
      "2021_A_Rybinskoye Reservoir",
      "2022_C_Devinska_Kobyla"
    ]
  },
  {
    id: "fiction",
    title: "spatial fiction",
    description: "Imagined institutions, speculative scenarios and alternative spatial realities.",
    x: 76,
    y: 84,
    size: "small",
    relatedTo: ["exhibition", "archive-memory"],
    projectSlugs: [
      "2023_A_No_Soup_Exhibition",
      "2023_A_Factory_of_Nothing_Tapes"
    ]
  }
];
