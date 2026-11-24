"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { RoleProvider } from "@/components/role-provider";
import { ToastProvider } from "@/components/ui/toast";
import { getQueryClient } from "@/utils/orpc";

import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			enableSystem
		>
			<QueryClientProvider client={queryClient}>
				<ToastProvider>
					<RoleProvider>{children}</RoleProvider>
				</ToastProvider>
				<ReactQueryDevtools />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
