import type { Dict, Locale } from "@/dictionaries";
import PresentationShell from "@/components/PresentationShell";
import Intro from "@/components/chapters/Intro";
import Manifesto from "@/components/chapters/Manifesto";
import SeismicSafety from "@/components/chapters/SeismicSafety";
import Stats from "@/components/chapters/Stats";
import Projects from "@/components/chapters/Projects";
import Process from "@/components/chapters/Process";
import Advantages from "@/components/chapters/Advantages";
import Founder from "@/components/chapters/Founder";
import Ambassadors from "@/components/chapters/Ambassadors";
import ClientExperience from "@/components/chapters/ClientExperience";
import FloorPlans from "@/components/chapters/FloorPlans";
import ConstructionClips from "@/components/chapters/ConstructionClips";
import Contact from "@/components/chapters/Contact";

export default function Home({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <PresentationShell locale={locale} dict={dict}>
      <main>
        <Intro />
        <Manifesto />
        <SeismicSafety />
        <Stats />
        <Projects />
        <Process />
        <Advantages />
        <Founder />
        <Ambassadors />
        <ClientExperience />
        <FloorPlans />
        <ConstructionClips />
        <Contact />
      </main>
    </PresentationShell>
  );
}
