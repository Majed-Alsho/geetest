import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Equity Exchange | Premium Business Marketplace",
  description: "Where legacies find their next chapter. Confidential deal flow for high-net-worth investors seeking vetted business acquisitions worldwide.",
  keywords: ["Business Marketplace", "Investment", "M&A", "Business Acquisition", "Private Equity"],
  authors: [{ name: "Global Equity Exchange" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Global Equity Exchange | Premium Business Marketplace",
    description: "Confidential deal flow for high-net-worth investors seeking vetted business acquisitions worldwide.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Equity Exchange",
    description: "Confidential deal flow for high-net-worth investors seeking vetted business acquisitions worldwide.",
  },
};

// Script to set theme before hydration to prevent flash
const themeScript = `
(function() {
  try {
    const stored = localStorage.getItem('gee-theme');
    const theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} antialiased bg-background text-foreground`} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
