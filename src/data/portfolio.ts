export const site = {
  name: "Musab Atieh",
  brand: "Musab Atieh",
  title: "ASP.NET Core & SQL Backend Developer",
  tagline:
    "I design database schemas, write complex stored procedures, and build APIs for data-heavy systems — AVL tracking, notifications, and high-throughput backends.",
  location: "Amman, Jordan",
  email: "atiehmusab@gmail.com",
  availability: "Open to freelance backend & database projects",
  rate: "$20/hr (typical range $20–35/hr)",
  replyWithin: "12–24 hours",
  photo: "/musab-atieh.png",
  github: "https://github.com/Musab991",
  linkedin: "https://www.linkedin.com/in/musab-atieh-833307282",
  upwork: "https://www.upwork.com/freelancers/~0101d6654adf2cb704",
  freelancer: "",
};

export const about = {
  headline: "About",
  body: [
    "I'm a full-stack developer focused on ASP.NET Core backends and SQL Server, with about 2.5 years of experience building APIs, schemas, and stored procedures for systems that move a lot of data.",
    "My niche is data-heavy work: designing schemas the right way, optimizing queries and writes with Entity Framework and ADO.NET, and keeping live pipelines (tracking, notifications, Kafka consumers, webhooks) fast and reliable.",
    "I work with clear design patterns, Domain-Driven Design (DDD) when the domain needs it, SignalR for live updates, and unit tests so changes stay safe. Based in Amman, Jordan — shipping on .NET 8/9/10 with Azure, Docker, and IIS.",
  ],
};

export const skills = {
  headline: "Skills",
  groups: [
    {
      label: "Backend",
      items: [
        "ASP.NET Core (.NET 8 / 9 / 10)",
        "C#",
        "REST APIs & webhooks",
        "SignalR",
        "Entity Framework + ADO.NET",
        "Windows Forms",
      ],
    },
    {
      label: "Database & data",
      items: [
        "SQL Server",
        "Schema design",
        "Stored procedures",
        "Query & write optimization",
        "Large / high-volume datasets",
        "Kafka + consumers",
      ],
    },
    {
      label: "Architecture & delivery",
      items: [
        "Design patterns",
        "Domain-Driven Design (DDD)",
        "Unit testing",
        "Azure / Docker / IIS",
        "AVL tracking & notifications",
        "Mobile app backends",
      ],
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
    stack: ["Windows Forms", "C#", "SQL Server", "CRUD workflows", "DDD-style modules"],
    problem:
      "The firm ran lawyer work across messy files and manual steps. They needed one desktop system for cases, clients, and services — real multi-screen CRUD, not a simple form demo.",
    solution:
      "Built a Windows Forms app with structured modules for lawyers’ daily work: clients, cases, and service workflows, backed by SQL Server and clear domain boundaries so new features could be added without breaking the rest.",
    result:
      "The office moved daily work into the app instead of scattered sheets. Staff could add and follow services for each lawyer faster, with less duplicate data entry and clearer case status across the team.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: "الشغل مرتب ويرد بسرعة. فهم المطلوب من أول مرة وسلّم على الوقت.",
    name: "أحمد",
    role: "صاحب مشروع — عمّان",
  },
  {
    quote: "ظبطلنا الـ API والداتا صح، والتطبيق اشتغل مرتاح بعد ما خلص.",
    name: "خالد",
    role: "مشرف تقني",
  },
];
