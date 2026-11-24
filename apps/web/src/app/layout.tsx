import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
	description: "Inbox for order exceptions at a B2B distributor",
	title: "Order Exceptions",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn(fontSans.variable, fontMono.variable)}
			lang="en"
			suppressHydrationWarning
		>
			<body className="antialiased">
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Header />
						<main className="overflow-y-auto">{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
