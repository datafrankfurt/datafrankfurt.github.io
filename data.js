/*
  Everything on the board lives here. Edit this file to change the site.

  Coordinates (x, y) are in board pixels; the board starts at 0,0 top-left.
  Card types:
    title   – the big name on the board
    note    – a sticky note  (color: "yellow" | "blue" | "white", rotate: degrees)
    project – a project card (glyph: "network" | "bars" | "line" | "flow" | "grid" | "matrix")
    post    – a blog post card (date, url, summary)
    link    – a simple link card
  Frames are the labelled areas cards sit in. A card belongs to a frame via `frame`.
*/

window.BOARD = {
  frames: [
    { id: "sports",   title: "Sports analytics",   caption: "Basketball, networks and play-by-play data", x: 120,  y: 260,  w: 600, h: 440 },
    { id: "finance",  title: "Finance & investing", caption: "Portfolios, risk and simulation",          x: 2040, y: 140,  w: 800, h: 450 },
    { id: "products", title: "Data products & AI",  caption: "Tools built for teams that run on data",   x: 120,  y: 1060, w: 800, h: 460 },
    { id: "writing",  title: "Writing",             caption: "Posts I publish on LinkedIn",              x: 1080, y: 1300, w: 800, h: 320 },
    { id: "lab",      title: "Experiments",         caption: "Small things built out of curiosity",      x: 2040, y: 790,  w: 800, h: 430 },
    { id: "contact",  title: "Find me",             caption: "",                                         x: 2040, y: 1400, w: 800, h: 300 }
  ],

  cards: [
    // ---- Centre ----------------------------------------------------------
    { id: "title", type: "title", x: 1060, y: 520, w: 860,
      text: "Data Frankfurt",
      sub: "The working board of Eduardo Garcia: projects, experiments and writing about data, from Frankfurt am Main." },

    { id: "hello", type: "note", color: "white", x: 1080, y: 990, w: 360, rotate: -1,
      title: "Hi, I'm Eduardo",
      body: "I like turning messy data into something people can see and use: sports networks, portfolio simulators, data contracts. This board is where it all lives, in no particular order." },

    { id: "howto", type: "note", color: "yellow", x: 1520, y: 1005, w: 260, rotate: 2,
      title: "How to read this board",
      body: "Drag the background to move around. Pinch or Ctrl + scroll to zoom." },

    // ---- Sports analytics ------------------------------------------------
    { id: "knicks", type: "project", frame: "sports", x: 170, y: 370, w: 500, glyph: "network",
      title: "The Network Is The Offense",
      body: "Every made basket of the Knicks' 2026 playoff run, mapped as an assist network: node size is points scored, every edge is a pass that became a bucket.",
      tags: ["NBA", "Network analysis", "Cloud Run"],
      url: "https://knicks-playoff-run-362940142596.europe-west3.run.app/",
      cta: "Open the app" },

    // ---- Finance ---------------------------------------------------------
    { id: "portopt", type: "project", frame: "finance", x: 2080, y: 240, w: 340, glyph: "bars",
      title: "Portfolio optimisation",
      body: "Runs scenarios on historical prices to find the mix of stocks with the lowest risk for the highest return.",
      tags: ["Optimisation", "Jupyter"],
      url: "https://github.com/egarcia00/Portfolio_Optimization_Medium" },

    { id: "portsim", type: "project", frame: "finance", x: 2470, y: 240, w: 330, glyph: "line",
      title: "Portfolio simulator",
      body: "A notebook for simulating how a stock portfolio could perform.",
      tags: ["Simulation", "Jupyter"],
      url: "https://github.com/egarcia00/Portfolio_Simulator" },

    // ---- Data products & AI ----------------------------------------------
    { id: "dch", type: "project", frame: "products", x: 160, y: 1160, w: 340, glyph: "flow",
      title: "DataContractHub",
      body: "A multi-agent AI system that drafts and manages ODCS-compliant data contracts. Built for a hackathon.",
      tags: ["AI agents", "Data contracts"],
      url: "https://github.com/egarcia00/DataContractHub" },

    { id: "crm", type: "project", frame: "products", x: 550, y: 1160, w: 330, glyph: "grid",
      title: "Streamlit CRM",
      body: "A CRM dashboard with assets-under-management timelines, customer comments and a Snowflake-ready data layer.",
      tags: ["Streamlit", "Snowflake"],
      url: "https://github.com/egarcia00/StreamlitCRM" },

    // ---- Writing (add posts here) ------------------------------------------
    // Example post card:
    // { id: "post-1", type: "post", frame: "writing", x: 1120, y: 1260, w: 340,
    //   title: "Post title", date: "2026-11-20", body: "One or two lines about the post.",
    //   url: "https://www.linkedin.com/posts/..." },

    { id: "writing-empty", type: "note", frame: "writing", color: "yellow", x: 1120, y: 1410, w: 330, rotate: -1,
      title: "First posts are on their way",
      body: "I write about data projects on LinkedIn. New posts will be pinned to this part of the board." },

    { id: "linkedin-follow", type: "link", frame: "writing", x: 1500, y: 1420, w: 330,
      title: "Read my posts on LinkedIn",
      body: "linkedin.com/in/eduardo-at-datafrankfurt",
      url: "https://www.linkedin.com/in/eduardo-at-datafrankfurt/recent-activity/all/" },

    // ---- Experiments -----------------------------------------------------
    { id: "gametheory", type: "project", frame: "lab", x: 2080, y: 890, w: 330, glyph: "matrix",
      title: "Game theory simulations",
      body: "Game theory simulations in a notebook, inspired by Veritasium's video on the topic.",
      tags: ["Simulation", "Jupyter"],
      url: "https://github.com/egarcia00/GameTheory_Veritasium" },

    { id: "nodo", type: "project", frame: "lab", x: 2470, y: 890, w: 330, glyph: "grid",
      title: "Nodo & Company website",
      body: "The website for Nodo and Company.",
      tags: ["Web"],
      url: "https://github.com/egarcia00/nodo-and-company-website" },

    // ---- Contact ---------------------------------------------------------
    { id: "c-linkedin", type: "link", frame: "contact", x: 2080, y: 1500, w: 230,
      title: "LinkedIn", body: "eduardo-at-datafrankfurt", url: "https://www.linkedin.com/in/eduardo-at-datafrankfurt/" },
    { id: "c-github", type: "link", frame: "contact", x: 2340, y: 1500, w: 230,
      title: "GitHub", body: "egarcia00", url: "https://github.com/egarcia00" },
    { id: "c-impressum", type: "link", frame: "contact", x: 2600, y: 1500, w: 200,
      title: "Impressum", body: "Legal notice", url: "impressum.html", internal: true }
  ],

  // Lines drawn from the title to each frame.
  connections: ["sports", "finance", "products", "writing", "lab", "contact"]
};
