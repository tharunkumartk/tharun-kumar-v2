import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import ServiceWorkerUnregister from "./components/ServiceWorkerUnregister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Tharun Kumar",
  description: "Princeton University '26",
  icons: {
    icon: "/favico.ico",
  },
  openGraph: {
    title: "Tharun Kumar",
    description: "Princeton University '26",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Tharun Kumar",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharun Kumar",
    description: "Princeton University '26",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceSerif.variable} bg-background text-foreground antialiased`}
      >
        <ServiceWorkerUnregister />
        {children}
      </body>
    </html>
  );
}
