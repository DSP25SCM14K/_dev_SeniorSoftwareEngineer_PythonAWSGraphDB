import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  "https://dsp25scm14k.github.io/_dev_SeniorSoftwareEngineer_PythonAWSGraphDB/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Dev Kumar — Connected Systems",
  description:
    "Python, AWS, and graph-backed systems that turn relationships into fast, explainable decisions.",
  openGraph: {
    title: "Dev Kumar — Connected Systems",
    description:
      "Python, AWS, and graph-backed systems that turn relationships into fast, explainable decisions.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}og.png`,
        width: 1536,
        height: 864,
        alt: "Dev Kumar — Connected Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Kumar — Connected Systems",
    description: "Python · AWS · Graph Data",
    images: [`${siteUrl}og.png`],
  },
  icons: {
    icon: `${siteUrl}og.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
