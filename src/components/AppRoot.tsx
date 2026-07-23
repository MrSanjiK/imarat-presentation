import "@/app/globals.css";
import { Playfair_Display, Manrope, Caveat, IBM_Plex_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import type { Locale } from "@/dictionaries";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-caveat",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});

export default function AppRoot({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${playfair.variable} ${manrope.variable} ${caveat.variable} ${plexMono.variable}`}
    >
      <body className="grain antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
