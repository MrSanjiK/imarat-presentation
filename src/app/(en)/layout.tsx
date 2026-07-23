import AppRoot from "@/components/AppRoot";
import { buildMetadata, sharedViewport } from "@/lib/meta";
import en from "@/dictionaries/en";

export const metadata = buildMetadata("en", en);
export const viewport = sharedViewport;

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <AppRoot lang="en">{children}</AppRoot>;
}
