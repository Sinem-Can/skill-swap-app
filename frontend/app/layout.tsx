import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "SkillSwap | Akıllı Yetenek Takası",
  description: "Graf tabanlı yetenek eşleştirme platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50">
        <Toaster position="bottom-right" />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}