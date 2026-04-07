import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const oswald = Oswald({
  variable: "--font-oswald-family",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter-family",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marvel Universe: Cinematic Character Guide",
  description: "The definitive digital experience for exploring every character in the Marvel Cinematic Universe. Cinematic-grade character profiles, power stats, timelines, and more.",
  keywords: ["Marvel", "MCU", "Avengers", "Iron Man", "Spider-Man", "character guide", "cinematic"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Marvel Universe: Cinematic Character Guide",
    description: "Explore every character in the Marvel Cinematic Universe with cinematic-grade visual storytelling.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${oswald.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} value={{ dark: 'dark-mode', light: 'light-mode' }}>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
