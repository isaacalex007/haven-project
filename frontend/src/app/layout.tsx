import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <-- This import is essential
import { Toaster } from "~/components/ui/sonner"; // <-- For toast notifications

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Haven",
  description: "Your AI Real Estate Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster /> {/* <-- Add Toaster for notifications */}
      </body>
    </html>
  );
}