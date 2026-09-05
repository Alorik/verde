import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const montserrat = localFont({
  src: [
    {
      path: "./fonts/Montserrat-Regular.ttf",
      weight: "400",
    },
    {
      path: "./fonts/Montserrat-Medium.ttf",
      weight: "500",
    },
    {
      path: "./fonts/Montserrat-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Verde",
  description: "ESG Reporting Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} light h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
