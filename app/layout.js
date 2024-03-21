import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ecommetrica - Dashboard  ",
  description:
    "E-commerce consulting with a team of digital experts in marketing and tech dev-ops, assembled, especially for B2B and B2C",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
