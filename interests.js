// Main-page interest map with meaningful links.
// Edit this file when you want to add, remove or rename nodes.
//
// x and y are percentages of the graph area.
// projectSlugs must match the slug values from projects.js.
//
// Link types are used both visually and conceptually:
// method   — one interest works as a method for another
// material — one interest gives material / evidence / traces
// scale    — connection through body, object, city, territory, landscape
// context  — shared research field or background condition
// tension  — productive conflict between two ideas
// medium   — one interest becomes a form of representation for another

const interests = [
  {
    id: "landscape-systems",
    title: "landscape systems",
    description: "Territories as layered ecological, cultural and infrastructural systems.",
    x: 18,
    y: 28,
    size: "large",
    links: [
      {
        target: "mapping",
        type: "method",
        label: "mapping makes territorial systems readable without reducing them to one layer"
      },
      {
        target: "ecology",
        type: "context",
        label: "ecological thinking shifts the project from an object to a set of long-term relations"
      },
      {
        target: "public-space",
        type: "scale",
        label: "landscape systems become political when they meet everyday public use"
      },
      {
        target: "post-industrial",
        type: "tension",
        label: "damaged industrial territories reveal the conflict between production, ecology and care"
      }
    ],
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
    links: [
      {
        target: "archive-memory",
        type: "method",
        label: "mapping organizes fragments, traces and documents into spatial arguments"
      },
      {
        target: "infrastructure",
        type: "method",
        label: "maps can expose systems that are present in space but not immediately visible"
      },
      {
        target: "landscape-systems",
        type: "method",
        label: "mapping helps move between detail, route, territory and landscape"
      }
    ],
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
    links: [
      {
        target: "post-industrial",
        type: "material",
        label: "post-industrial sites can be read as physical archives of former production"
      },
      {
        target: "exhibition",
        type: "medium",
        label: "archive becomes spatial when it is arranged, displayed and walked through"
      },
      {
        target: "fiction",
        type: "tension",
        label: "memory is never fully stable, so archival fragments can also produce fictional structures"
      },
      {
        target: "mapping",
        type: "method",
        label: "counter-mapping can connect partial memories into a territorial reading"
      }
    ],
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
    links: [
      {
        target: "infrastructure",
        type: "context",
        label: "industrial remains often expose the infrastructures that shaped the city around them"
      },
      {
        target: "archive-memory",
        type: "material",
        label: "ruins keep traces of work, extraction, abandonment and transformation"
      },
      {
        target: "landscape-systems",
        type: "scale",
        label: "a post-industrial site is not isolated; it belongs to larger territorial and ecological systems"
      },
      {
        target: "public-space",
        type: "tension",
        label: "abandoned or transformed production zones raise questions about access and collective use"
      }
    ],
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
    links: [
      {
        target: "mapping",
        type: "method",
        label: "infrastructure often needs to be mapped before it can be critically understood"
      },
      {
        target: "public-space",
        type: "context",
        label: "public space is shaped by systems of movement, maintenance, access and control"
      },
      {
        target: "post-industrial",
        type: "context",
        label: "post-industrial landscapes are usually made from obsolete or transformed infrastructures"
      }
    ],
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
    links: [
      {
        target: "archive-memory",
        type: "medium",
        label: "exhibition turns archived fragments into a sequence, atmosphere and spatial argument"
      },
      {
        target: "fiction",
        type: "medium",
        label: "display can make a fictional institution or speculative world temporarily believable"
      },
      {
        target: "mapping",
        type: "method",
        label: "exhibition can work as a map: it selects, orders and connects evidence"
      }
    ],
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
    links: [
      {
        target: "landscape-systems",
        type: "scale",
        label: "public space is one of the scales where larger landscape systems become experienced"
      },
      {
        target: "infrastructure",
        type: "context",
        label: "public life depends on infrastructural conditions that are often treated as background"
      },
      {
        target: "ecology",
        type: "context",
        label: "ecological thinking changes how public space is maintained, shared and cared for"
      }
    ],
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
    links: [
      {
        target: "landscape-systems",
        type: "context",
        label: "ecology treats landscape as a set of relations rather than a neutral background"
      },
      {
        target: "public-space",
        type: "context",
        label: "shared space can become a place where ecological care is practiced collectively"
      },
      {
        target: "post-industrial",
        type: "tension",
        label: "ecology becomes sharper when it meets damaged, exhausted or contaminated territories"
      }
    ],
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
    links: [
      {
        target: "exhibition",
        type: "medium",
        label: "exhibition can temporarily materialize a fictional spatial system"
      },
      {
        target: "archive-memory",
        type: "tension",
        label: "fiction appears where memory, evidence and speculation begin to overlap"
      }
    ],
    projectSlugs: [
      "2023_A_No_Soup_Exhibition",
      "2023_A_Factory_of_Nothing_Tapes"
    ]
  }
];
