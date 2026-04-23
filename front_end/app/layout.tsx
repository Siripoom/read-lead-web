import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import RoleSwitcher from "@/components/layout/RoleSwitcher";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReadLead — The Curated Anthology",
  description: "The premier destination for serial fiction and digital literary excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoSansThai.variable} h-full`}>
      <body className="min-h-full">
        <Providers>
          {children}
          <RoleSwitcher />
        </Providers>
      </body>
    </html>
  );
}
