import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Rugby Rankings Calculator",
  description: "Calculate World Rugby rankings based on match results",
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
