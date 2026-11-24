import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import {
	environmentManager,
	QueryCache,
	QueryClient,
} from "@tanstack/react-query";
import type { AppRouterClient } from "@wrk-live-deseng/api/routers/index";

import { toastManager } from "@/components/ui/toast";

export function createQueryClient() {
	return new QueryClient({
		queryCache: new QueryCache({
			onError: (error, query) => {
				toastManager.add({
					actionProps: {
						children: "Retry",
						onClick: () => {
							query.invalidate();
						},
					},
					title: `Error: ${error.message}`,
					type: "error",
				});
			},
		}),
	});
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
	if (environmentManager.isServer()) {
		return createQueryClient();
	}

	browserQueryClient ??= createQueryClient();
	return browserQueryClient;
}

export const link = new RPCLink({
	fetch: (url, options) =>
		fetch(url, {
			...options,
			credentials: "include",
		}),
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return Object.fromEntries(await headers());
	},
	url: `${typeof window === "undefined" ? "http://localhost:3001" : window.location.origin}/api/rpc`,
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
