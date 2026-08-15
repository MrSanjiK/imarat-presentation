import AppRoot from "@/components/AppRoot";
import { buildMetadata, sharedViewport } from "@/lib/meta";
import ar from "@/dictionaries/ar";

export const metadata = buildMetadata("ar", ar);
export const viewport = sharedViewport;

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return <AppRoot lang="ar" dir="rtl">{children}</AppRoot>;
}
