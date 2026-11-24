"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { orpc } from "@/utils/orpc";

import { ExceptionDrawer } from "./exception-drawer";
import { ExceptionRow } from "./exception-row";
import {
	useAssignException,
	useResolveException,
} from "./use-exception-mutations";

export function ExceptionInbox() {
	const exceptions = useQuery(orpc.exceptions.list.queryOptions());
	const assign = useAssignException();
	const resolve = useResolveException();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	if (exceptions.status === "pending") {
		return <p className="p-page text-muted-foreground">Loading exceptions…</p>;
	}
	if (exceptions.status === "error") {
		return (
			<p className="p-page text-status-danger-foreground">
				Couldn't load exceptions.
			</p>
		);
	}

	// Most recently touched first, so whatever you just worked on is easy to find.
	const rows = exceptions.data.toSorted((a, b) =>
		b.updatedAt.localeCompare(a.updatedAt)
	);
	const selected = exceptions.data.find(
		(exception) => exception.id === selectedId
	);

	return (
		<div className="flex flex-col gap-stack p-page">
			<div>
				<h1 className="font-heading text-title">Inbox</h1>
				<p className="text-meta text-muted-foreground">
					{rows.length} exceptions
				</p>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Status</TableHead>
						<TableHead>Priority</TableHead>
						<TableHead>Order</TableHead>
						<TableHead>Problem</TableHead>
						<TableHead>SLA</TableHead>
						<TableHead>Assignee</TableHead>
						<TableHead>
							<span className="sr-only">Actions</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((exception, index) => (
						<ExceptionRow
							exception={exception}
							// biome-ignore lint/suspicious/noArrayIndexKey: rows render in a fixed order
							key={index}
							onAssign={(assigneeId) =>
								assign.mutate({ assigneeId, id: exception.id })
							}
							onOpen={() => {
								setSelectedId(exception.id);
								setIsDrawerOpen(true);
							}}
							onResolve={() =>
								resolve.mutate({ id: exception.id, status: "resolved" })
							}
						/>
					))}
				</TableBody>
			</Table>
			<ExceptionDrawer
				exception={selected}
				onOpenChange={setIsDrawerOpen}
				open={isDrawerOpen}
			/>
		</div>
	);
}
