export const site = {
  name: "Musab Atieh",
  brand: "Musab Atieh",
  title: "Full Stack .NET Developer",
  tagline:
    "I build web dashboards, mobile app backends and desktop systems with C#, ASP.NET MVC, EF Core and SQL Server — with a focus on database design, performance tuning and real-time AVL tracking.",
  location: "Amman, Jordan",
  email: "atiehmusab@gmail.com",
  telegram: "https://t.me/musabatieh",
  telegramHandle: "@musabatieh",
  availability: "Open to freelance backend & database projects",
  rate: "$20/hr (typical range $20–35/hr)",
  replyWithin: "12–24 hours",
  photo: "/musab-atieh.png",
  github: "https://github.com/Musab991",
  linkedin: "https://www.linkedin.com/in/musab-atieh-833307282",
  upwork: "https://www.upwork.com/freelancers/~0101d6654adf2cb704",
  freelancer: "",
};

export type NavLink = { href: string; label: string; labelAr: string };

/** Top navigation (English labels on the site, Arabic labels on /workshops). */
export const navLinks: NavLink[] = [
  { href: "/", label: "Home", labelAr: "الرئيسية" },
  { href: "/projects/", label: "Projects", labelAr: "المشاريع" },
  { href: "/cv/", label: "CV", labelAr: "السيرة الذاتية" },
  { href: "/workshops/", label: "Workshops", labelAr: "الورشات" },
  { href: "/contact/", label: "Contact", labelAr: "تواصل" },
];

/** Public profile links that are actually filled in. */
export const profileLinks = [
  { href: site.github, label: "GitHub" },
  { href: site.linkedin, label: "LinkedIn" },
  { href: site.upwork, label: "Upwork" },
  { href: site.freelancer, label: "Freelancer" },
].filter((link) => link.href);

export const about = {
  headline: "About",
  body: [
    "I'm a Full Stack .NET Developer with 2+ years of experience building web dashboards, mobile app backends and desktop systems with C#, ASP.NET MVC, EF Core and SQL Server.",
    "I built two production mobile backends from scratch and contributed to a large-scale real-time AVL vehicle tracking platform with GIS mapping (Leaflet.js, GeoJSON). I'm strong in database design and performance tuning: stored procedures, indexing, SQL Jobs and EF Core query optimization for large datasets.",
    "I apply Domain-Driven Design, the Specification Pattern and clean architecture to keep systems scalable and testable. Based in Amman, Jordan — currently deepening my full stack ASP.NET, RESTful API and clean code skills through a 7-month training program.",
  ],
};

/** Skill groups, taken from the CV's "Technical Skills" section. */
export const skills = {
  headline: "Skills",
  groups: [
    {
      label: "Backend",
      items: ["C#", ".NET", "ASP.NET MVC", "RESTful APIs", "EF Core", "ADO.NET", "LINQ"],
    },
    {
      label: "Frontend",
      items: ["Razor", "JavaScript", "HTML5", "CSS3", "Leaflet.js"],
    },
    {
      label: "Database",
      items: [
        "SQL Server",
        "T-SQL",
        "Stored procedures",
        "Views",
        "SQL Agent Jobs",
        "Indexing",
        "Query optimization",
      ],
    },
    {
      label: "Architecture & patterns",
      items: [
        "Domain-Driven Design",
        "Specification Pattern",
        "Repository/Service layers",
        "Clean architecture",
      ],
    },
    {
      label: "GIS & mapping",
      items: [
        "Leaflet.js",
        "GeoJSON",
        "Dynamic layers & overlays",
        "Real-time tracking (AVL)",
      ],
    },
    {
      label: "Desktop",
      items: ["Windows Forms"],
    },
    {
      label: "Performance",
      items: ["N+1 elimination", "Projections", "Compiled queries", "Caching"],
    },
  ],
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption: string;
};

export type Project = {
  id: string;
  title: string;
  client: string;
  role: string;
  /** One line for cards. */
  summary: string;
  stack: string[];
  problem: string;
  solution: string;
  result: string;
  link?: string;
  images?: ProjectImage[];
};

export const projects: Project[] = [
  {
    id: "avl-tracking",
    title: "AVL live tracking & high-volume data pipeline",
    client: "Government-related client — Saudi Arabia",
    role: "Backend / database developer",
    summary:
      "Live tracking pipeline for ~50,000 vehicles sending an AVL signal every 30 seconds.",
    stack: [
      "ASP.NET Core",
      "EF + ADO.NET",
      "SQL Server",
      "Stored procedures",
      "Kafka",
      "SignalR",
      "Webhooks",
      "Azure / Docker / IIS",
    ],
    problem:
      "The platform had to track a large fleet in near real time — about 50,000 vehicles sending a new AVL signal every 30 seconds — then process, clean, and deliver that stream as usable live maps, history, stops, and notifications without falling behind.",
    solution:
      "Designed schemas and complex stored procedures for bulk AVL processing; used EF and ADO.NET where each fit best; built Kafka consumers for high-throughput ingestion; used SignalR for live UI updates; implemented webhooks for downstream delivery; supported live fleet views, route history / stop points, and historical analytics.",
    result:
      "Stable production pipeline for ~50,000 devices at a 30-second AVL interval (about 1.6M+ signals per hour at full load), with operators using live tracking, stop history, and analytics screens day to day. Screenshots below.",
    images: [
      {
        src: "/projects/avl/live-fleet.png",
        alt: "Live AVL map with vehicle popup and fleet status dashboard in Arabic",
        caption: "Live tracking + fleet status",
      },
      {
        src: "/projects/avl/route-history.png",
        alt: "Historical route map with numbered stops and stop-duration sidebar",
        caption: "Route history & stop points",
      },
      {
        src: "/projects/avl/historical-analytics.png",
        alt: "Historical analytics dashboard extracting and cleaning AVL route data",
        caption: "Historical analytics / route extraction",
      },
    ],
  },
  {
    id: "mobile-backends",
    title: "Mobile app backends from scratch (×2)",
    client: "Service & field-operations mobile products",
    role: "Backend developer",
    summary:
      "Two mobile app backends built from scratch: schemas, REST APIs, and unit-tested core logic.",
    stack: [
      "ASP.NET Core",
      "SQL Server",
      "REST APIs",
      "EF / ADO.NET",
      "Unit testing",
    ],
    problem:
      "Two mobile products needed a proper backend from day one — clear database structure, solid APIs, and data rules the apps could trust — not something patched together later.",
    solution:
      "Built both backends from scratch: designed schemas, implemented REST APIs, applied clean structure with design patterns, and covered critical paths with unit tests so the mobile teams could ship without fighting the server.",
    result:
      "Both apps launched on a stable API and database layer. Auth, core CRUD, and sync endpoints stayed reliable under normal production use, with fewer backend bugs after release because the important logic was tested.",
  },
  {
    id: "lawyer-winforms",
    title: "Law-firm desktop system (Windows Forms)",
    client: "Law firm — Amman / Jordan",
    role: "Full-stack desktop developer",
    summary:
      "One desktop system for a law firm's clients, cases, and service workflows.",
    stack: ["Windows Forms", "C#", "SQL Server", "CRUD workflows", "DDD-style modules"],
    problem:
      "The firm ran lawyer work across messy files and manual steps. They needed one desktop system for cases, clients, and services — real multi-screen CRUD, not a simple form demo.",
    solution:
      "Built a Windows Forms app with structured modules for lawyers’ daily work: clients, cases, and service workflows, backed by SQL Server and clear domain boundaries so new features could be added without breaking the rest.",
    result:
      "The office moved daily work into the app instead of scattered sheets. Staff could add and follow services for each lawyer faster, with less duplicate data entry and clearer case status across the team.",
  },
];

export type CvJob = {
  title: string;
  company: string;
  location?: string;
  start: string;
  end: string;
  points: string[];
};

export type CvTraining = Omit<CvJob, "company">;

/**
 * CV page data, taken from the owner's CV ("Full Stack .NET Developer", 3-page PDF).
 * Empty sections are hidden on the page.
 */
export const cv = {
  // The source PDF lists a phone number, so it is NOT published in public/.
  // TODO (owner): export a public version of the PDF without the phone number, add it at
  // public/cv/Musab_Atieh_Full_Stack_NET_Developer_CV.pdf and set this to
  // "/cv/Musab_Atieh_Full_Stack_NET_Developer_CV.pdf".
  // While null, the "Download CV" button opens the browser's print dialog (Save as PDF).
  pdf: null as string | null,
  summary: [
    "Full Stack .NET Developer with 2+ years of experience building web dashboards, mobile app backends and desktop systems with C#, ASP.NET MVC, EF Core and SQL Server. Built two production mobile backends from scratch and contributed to a large-scale real-time AVL vehicle tracking platform with GIS mapping (Leaflet.js, GeoJSON).",
    "Strong in database design and performance tuning: stored procedures, indexing, SQL Jobs and EF Core query optimization for large datasets. Applies Domain-Driven Design, the Specification Pattern and clean architecture to keep systems scalable and testable. Currently deepening skills in full stack ASP.NET, RESTful APIs and clean code through a 7-month training program.",
  ],
  experience: [
    {
      title: "Full Stack .NET Developer",
      company: "Coderz Company",
      location: "Amman, Jordan",
      start: "Nov 2024",
      end: "Present",
      points: [
        "Architected and built two mobile application backends from scratch, covering API design, database modeling and integration with the mobile teams.",
        "Developed a web dashboard with ASP.NET MVC, Razor and EF Core for business operations and analytics.",
        "Contributed to a large-scale AVL (Automatic Vehicle Location) tracking system, delivering real-time tracking features and map-based workflows with a cross-functional team.",
        "Built GIS features end to end: Leaflet.js rendering, dynamic layers and overlays, tooltips and zoom control on the frontend; GeoJSON processing and overlay management on the backend.",
        "Improved performance on large datasets by eliminating N+1 queries and adding indexing, projections, compiled queries and caching.",
        "Wrote SQL Jobs, stored procedures and scripts to calculate KPIs such as process completion percentage and operational performance metrics.",
        "Structured backend systems with Domain-Driven Design and the Specification Pattern for reusable, testable data access.",
        "Created an internal backend framework that standardized error handling, response wrappers, service-layer patterns and common EF Core logic across projects.",
        "Diagnosed and refactored performance bottlenecks and production issues, improving system reliability.",
      ],
    },
    {
      title: ".NET Developer",
      company: "Aadel",
      location: "Amman, Jordan",
      start: "Feb 2024",
      end: "Sep 2024",
      points: [
        "Ran client meetings to gather business requirements and turned them into detailed Product Requirement Documents (PRDs).",
        "Designed complete technical solutions, including system workflows, architecture and development plans.",
        "Designed relational database schemas in SQL Server for performance and data integrity.",
        "Built Windows Forms applications with C#, SQL Server and ADO.NET for data access and business logic.",
        "Wrote and optimized stored procedures, views and queries to speed up data processing.",
        "Worked with stakeholders across the lifecycle to refine specifications and deliver on business goals.",
      ],
    },
  ] as CvJob[],
  training: [
    {
      title: "Full Stack ASP.NET Training",
      location: "Amman, Jordan (On-site)",
      start: "Mar 2026",
      end: "Present (7 months)",
      points: [
        "Studied C#, OOP, ASP.NET, ADO.NET, RESTful API development, database design, HTML, CSS and JavaScript.",
        "Built a full stack e-commerce application with ASP.NET Core and JWT authentication.",
        "Practiced debugging, clean code, SOLID principles and professional soft skills.",
      ],
    },
  ] as CvTraining[],
  competencies: [
    "Requirements gathering",
    "Client communication",
    "Performance tuning",
    "Debugging and problem solving",
    "Team collaboration",
  ],
  // TODO (owner): the CV has no education section — add degree, university and year if wanted.
  education: [] as { degree: string; school: string; year: string }[],
  languages: ["Arabic (native)", "English"],
};
