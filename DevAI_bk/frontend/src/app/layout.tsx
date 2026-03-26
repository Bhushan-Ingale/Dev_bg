import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: "DevAI - Intelligent Code Analytics",
  description: "AI-powered code analytics platform for student teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white m-0 p-0">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}