import AppRoot from "@/components/AppRoot";
import { buildMetadata, sharedViewport } from "@/lib/meta";
import uz from "@/dictionaries/uz";

export const metadata = buildMetadata("uz", uz);
export const viewport = sharedViewport;

export default function UzLayout({ children }: { children: React.ReactNode }) {
  return <AppRoot lang="uz">{children}</AppRoot>;
}
