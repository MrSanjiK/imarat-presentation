"use client";

import { type Dict } from "@/dictionaries";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import ChapterLabel from "@/components/ui/ChapterLabel";

gsap.registerPlugin(ScrollTrigger);

type ProjectData = {
  name: string;
  landArea: string;
  totalArea: string;
  blocks: number;
  started: number;
  built: string;
};

const PROJECTS_DATA: ProjectData[] = [
  {
    name: "Sergeli City",
    landArea: "56",
    totalArea: "680 000",
    blocks: 30,
    started: 30,
    built: "180 000",
  },
  {
    name: "Eco Park",
    landArea: "19",
    totalArea: "244 000",
    blocks: 16,
    started: 16,
    built: "80 000",
  },
  {
    name: "Bristol 1",
    landArea: "6.5",
    totalArea: "87 000",
    blocks: 8,
    started: 8,
    built: "87 000",
  },
  {
    name: "Tuzel Park",
    landArea: "5",
    totalArea: "100 000",
    blocks: 12,
    started: 12,
    built: "100 000",
  },
  {
    name: "Yangi Hayot",
    landArea: "9",
    totalArea: "132 000",
    blocks: 10,
    started: 10,
    built: "132 000",
  },
  {
    name: "Chortoq",
    landArea: "160",
    totalArea: "210 000",
    blocks: 7,
    started: 7,
    built: "210 000",
  },
  {
    name: "Bristol 2",
    landArea: "5.5",
    totalArea: "100 000",
    blocks: 11,
    started: 1,
    built: "15 000",
  },
  {
    name: "Gazalkent",
    landArea: "50",
    totalArea: "60 000",
    blocks: 0,
    started: 0,
    built: "0",
  },
  {
    name: "IMARAT Hills",
    landArea: "13",
    totalArea: "25 000",
    blocks: 205,
    started: 0,
    built: "0",
  },
  {
    name: "Tabiat",
    landArea: "60",
    totalArea: "80 000",
    blocks: 0,
    started: 0,
    built: "0",
  },
  {
    name: "IMARAT Hills 2",
    landArea: "20",
    totalArea: "40 000",
    blocks: 300,
    started: 0,
    built: "0",
  },
];

type ProjectsInfoProps = {
  dict: Dict;
};

export default function ProjectsInfo({ dict }: ProjectsInfoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !tableRef.current) return;

      const rows = tableRef.current.querySelectorAll("tr");

      gsap.from(rows, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tableRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects-info"
      data-chapter="projects-info"
      className="chapter relative min-h-screen bg-surface py-24 px-6"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 text-center">
          <ChapterLabel index="06" className="mb-6 justify-center">
            {dict.projectsInfo.label}
          </ChapterLabel>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl">
            {dict.projectsInfo.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-foreground/70">
            {dict.projectsInfo.sub}
          </p>
        </div>

        <div
          ref={tableRef}
          className="overflow-x-auto rounded-[20px] bg-bg border border-line"
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-4 text-left font-mono text-xs uppercase tracking-wider text-foreground/60">
                  {dict.projectsInfo.projectCol}
                </th>
                <th className="px-4 py-4 text-right font-mono text-xs uppercase tracking-wider text-foreground/60">
                  {dict.projectsInfo.landCol}
                </th>
                <th className="px-4 py-4 text-right font-mono text-xs uppercase tracking-wider text-foreground/60">
                  {dict.projectsInfo.totalCol}
                </th>
                <th className="px-4 py-4 text-right font-mono text-xs uppercase tracking-wider text-foreground/60">
                  {dict.projectsInfo.blocksCol}
                </th>
                <th className="px-4 py-4 text-right font-mono text-xs uppercase tracking-wider text-foreground/60">
                  {dict.projectsInfo.startedCol}
                </th>
                <th className="px-4 py-4 text-right font-mono text-xs uppercase tracking-wider text-foreground/60">
                  {dict.projectsInfo.builtCol}
                </th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS_DATA.map((project, i) => (
                <tr
                  key={project.name}
                  className="border-b border-line last:border-b-0 transition-colors hover:bg-accent/5"
                >
                  <td className="px-4 py-4 font-medium">{project.name}</td>
                  <td className="px-4 py-4 text-right font-mono text-sm">
                    {project.landArea} {dict.projectsInfo.haUnit}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-sm">
                    {project.totalArea} {dict.projectsInfo.m2Unit}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-sm">
                    {project.blocks}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-sm">
                    {project.started}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-sm text-accent">
                    {project.built} {dict.projectsInfo.m2Unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-foreground/50">
            {dict.projectsInfo.note}
          </p>
        </div>
      </div>
    </section>
  );
}
