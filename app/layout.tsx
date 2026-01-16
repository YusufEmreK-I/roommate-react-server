import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider } from "./context/AuthContext"; // Yoluna dikkat et (src/app/context ise ./context)

// Global Bileşenler
import TopNav from "../components/TopNav/TopNav"; // ✅ TopNav'ı buraya ekledik

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoomMate",
  description: "Ev arkadaşı bulma platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-center" />

          {/* ✅ ARTIK HER SAYFADA OTOMATİK ÇIKACAK */}
          <TopNav />

          {/* Sayfaların içeriği buraya gelir */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
