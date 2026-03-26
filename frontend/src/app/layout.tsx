import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExamProctor AI - Online Examination System",
  description: "AI-powered online examination system with intelligent proctoring",
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
