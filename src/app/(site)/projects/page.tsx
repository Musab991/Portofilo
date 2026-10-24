import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies: AVL live tracking for ~50,000 vehicles, mobile app backends, and a law-firm desktop system.",
};

export default function ProjectsPage() {
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Projects</p>
        <h1>Selected client work</h1>
        <p className="lead">
          Each case study follows the same structure: the problem, what I built,
          and the result.
        </p>
      </header>
      <div className="grid grid-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
