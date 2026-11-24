import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrderException } from "@wrk-live-deseng/api/exceptions/model";

import { toastManager } from "@/components/ui/toast";
import { orpc } from "@/utils/orpc";

function replaceException(
	list: OrderException[] | undefined,
	updated: OrderException
) {
	return list?.map((item) => (item.id === updated.id ? updated : item));
}

export function useAssignException() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.exceptions.update.mutationOptions({
			onError: (error) => {
				toastManager.add({
					description: error.message,
					title: "Couldn't assign",
					type: "error",
				});
			},
			onSuccess: (updated) => {
				queryClient.setQueryData(orpc.exceptions.list.queryKey(), (list) =>
					replaceException(list, updated)
				);
			},
		})
	);
}

/** Marks the row resolved right away so the list feels instant. */
export function useResolveException() {
	const queryClient = useQueryClient();
	const listKey = orpc.exceptions.list.queryKey();

	return useMutation(
		orpc.exceptions.update.mutationOptions({
			onError: (error) => {
				toastManager.add({
					description: error.message,
					title: "Couldn't resolve",
					type: "error",
				});
			},
			onMutate: async ({ id }) => {
				await queryClient.cancelQueries({ queryKey: listKey });
				queryClient.setQueryData(listKey, (list) =>
					list?.map((item) =>
						item.id === id ? { ...item, status: "resolved" as const } : item
					)
				);
			},
			onSuccess: (updated) => {
				queryClient.setQueryData(listKey, (list) =>
					replaceException(list, updated)
				);
			},
		})
	);
}
