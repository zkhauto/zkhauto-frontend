import { Inter } from "next/font/google";

import { useRouter } from "next/router";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import Footer from "./ui/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Car Marketplace",
  description: "Buy and sell cars online",
};

export default function RootLayout({ children }) {
  const router = useRouter();
  console.log("Current location:", router);
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
