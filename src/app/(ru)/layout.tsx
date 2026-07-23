import AppRoot from "@/components/AppRoot";
import { buildMetadata, sharedViewport } from "@/lib/meta";
import ru from "@/dictionaries/ru";

export const metadata = buildMetadata("ru", ru);
export const viewport = sharedViewport;

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return <AppRoot lang="ru">{children}</AppRoot>;
}
