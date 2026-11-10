import type { Metadata } from "next";
import { Instrument_Sans, DM_Mono } from "next/font/google";
import Smooth from "@/components/motion/Smooth";
import { getSiteUrl, getSiteUrlString, getSiteImageUrl } from "@/lib/site";
import { getSeoSettingsSafe } from "@/lib/api/blog";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-instrument-sans", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

// Material Symbols Outlined — must be loaded via <link> for ligatures to work
const materialSymbols = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap";

const fallbackTitle = "LeadsLemonade | Verified B2B emails, pay per reveal";
const fallbackDescription = "B2B lead finder for outbound sellers. Only pay for verified emails. Credits never expire. $5 for 100 credits.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSeoSettingsSafe();
  const title = settings?.defaultTitle || fallbackTitle;
  const description = settings?.defaultDescription || fallbackDescription;
  const image = settings?.defaultSocialImage || getSiteImageUrl();
  return {
  metadataBase: getSiteUrl(),
  title,
  description,
  keywords: ["B2B leads", "email finder", "verified emails", "lead database", "outbound"],
  openGraph: {
    title,
    description,
    type: "website",
    url: getSiteUrlString(),
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: "LeadsLemonade - Search for anyone easily",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
    >
      <head>
        <link rel="stylesheet" href={materialSymbols} />
      </head>
      <body>
        <Smooth />
        {children}
      </body>
    </html>
  );
}