import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TPN Project Tracker",
  description: "True Products Network Master Project Tracker",
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
