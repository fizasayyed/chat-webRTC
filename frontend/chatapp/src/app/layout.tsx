import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: "SneakSpeak",
  description: "Made with ❤️ by Fiza Sayyed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >{children}</body>
    </html>
  );
}
