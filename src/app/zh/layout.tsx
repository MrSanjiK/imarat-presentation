import AppRoot from "@/components/AppRoot";
import { buildMetadata, sharedViewport } from "@/lib/meta";
import zh from "@/dictionaries/zh";

export const metadata = buildMetadata("zh", zh);
export const viewport = sharedViewport;

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return <AppRoot lang="zh">{children}</AppRoot>;
}
