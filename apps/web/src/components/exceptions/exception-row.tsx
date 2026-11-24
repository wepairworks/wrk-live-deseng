"use client";

import type { OrderException } from "@wrk-live-deseng/api/exceptions/model";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import { AssigneeMenu } from "./assignee-menu";
import { PriorityBadge, StatusBadge } from "./exception-badges";
import { TYPE_LABELS } from "./labels";
import { SlaDue } from "./sla-due";

interface ExceptionRowProps {
	exception: OrderException;
	onAssign: (assigneeId: string) => void;
	onOpen: () => void;
	onResolve: () => void;
}

export function ExceptionRow({
	exception,
	onOpen,
	onAssign,
	onResolve,
}: ExceptionRowProps) {
	const isResolved = exception.status === "resolved";

	return (
		<TableRow>
			<TableCell className="py-row">
				<StatusBadge status={exception.status} />
			</TableCell>
			<TableCell className="py-row">
				<PriorityBadge priority={exception.priority} />
			</TableCell>
			<TableCell className="py-row">
				<div className="flex flex-col gap-1">
					<button
						className="w-fit cursor-pointer rounded-sm font-medium underline-offset-4 hover:underline"
						onClick={onOpen}
						type="button"
					>
						{exception.orderNumber}
					</button>
					<span className="text-meta text-muted-foreground">
						{exception.customer}
					</span>
				</div>
			</TableCell>
			<TableCell className="py-row">
				<div className="flex flex-col gap-1">
					<span>{TYPE_LABELS[exception.type]}</span>
					<span className="text-meta text-muted-foreground">
						{exception.summary}
					</span>
				</div>
			</TableCell>
			<TableCell className="py-row">
				{isResolved ? null : <SlaDue slaDueAt={exception.slaDueAt} />}
			</TableCell>
			<TableCell className="py-row">
				<AssigneeMenu assigneeId={exception.assigneeId} onAssign={onAssign} />
			</TableCell>
			<TableCell className="py-row text-right">
				<Button
					disabled={isResolved}
					onClick={onResolve}
					size="sm"
					variant="outline"
				>
					Resolve
				</Button>
			</TableCell>
		</TableRow>
	);
}
