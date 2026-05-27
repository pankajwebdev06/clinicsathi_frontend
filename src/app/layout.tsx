import type { Metadata, Viewport } from "next";
import "./globals.css";

// Use system fonts for fastest loading on 3G/low-end devices
// No external font requests needed
export const metadata: Metadata = {
  title: "DoctorKaDost — Modern Clinic Management",
  description: "Queue management, digital records, and patient check-in for Indian clinics. Built for low-bandwidth connections.",
  keywords: ["clinic management", "patient queue", "digital records", "India", "healthcare"],
  authors: [{ name: "DoctorKaDost" }],
  openGraph: {
    title: "DoctorKaDost — Modern Clinic Management",
    description: "Queue management, digital records, and patient check-in for Indian clinics.",
    type: "website",
  },
};

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <head>
        {/* Preconnect to common domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for API calls */}
        <link rel="dns-prefetch" href="https://api.doctorkadost.in" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
