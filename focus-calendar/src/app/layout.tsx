import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Focus Calendar - Stay on Track",
  description: "A daily calendar designed to keep you focused and productive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}