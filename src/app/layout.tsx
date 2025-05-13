import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "../components/auth/NextAuthProvider";
import { LoadingProvider } from "../context/LoadingContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AndCook - Delicious Recipes",
  description: "Discover and share delicious recipes from around the world",
  icons: {
    icon: "/favicon.ico",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextAuthProvider>
          <LoadingProvider>
            <Header />
            <main className="flex-grow pt-16 md:pt-20">{children}</main>
            <Footer />
          </LoadingProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
