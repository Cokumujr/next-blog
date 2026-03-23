import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { getToken } from "@/lib/auth-server";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { connection } from "next/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nadra Mental Health Blogs",
   description: "Here you'll find a collection of articles on various topics related to mental health and addiction recovery."
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
            <Suspense>

            <ConvexProvider >
              {children}
            </ConvexProvider>
            </Suspense>
            <Toaster closeButton  expand={true} visibleToasts={3}/>

          </main>
        </ThemeProvider>
      </body>
    </html>
  );
} 

async function ConvexProvider({ children }: { children: React.ReactNode }) {
  await connection();
  const token = await getToken();
  return (
    <ConvexClientProvider initialToken={token}>
      {children}
    </ConvexClientProvider>
  );
}
