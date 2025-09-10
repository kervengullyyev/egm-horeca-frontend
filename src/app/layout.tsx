import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/brand.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import CategoryMenu from "@/components/CategoryMenu";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EGM Horeca",
  description: "Premium horeca equipment and supplies",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geist.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
				<LanguageProvider>
					<Header />
					<CategoryMenu />
					{children}
					<Footer />
					<Toaster position="top-center" richColors />
				</LanguageProvider>
			</body>
		</html>
	);
}
