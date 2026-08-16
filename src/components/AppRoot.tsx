import "@/app/globals.css";
import { Playfair_Display, DM_Sans, Caveat, Space_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import type { Locale } from "@/dictionaries";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-caveat",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export default function AppRoot({
  lang,
  dir,
  children,
}: {
  lang: Locale;
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      dir={dir || "ltr"}
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${caveat.variable} ${spaceMono.variable}`}
    >
      <body className="grain antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
