import type {
	ExceptionPriority,
	ExceptionStatus,
} from "@wrk-live-deseng/api/exceptions/model";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { PRIORITY_LABELS, STATUS_LABELS } from "./labels";

type Tone = "danger" | "warning" | "success" | "info" | "neutral";

// Each tone maps to a --status-* token family in src/index.css.
const TONE_CLASSES: Record<Tone, { badge: string; dot: string }> = {
	danger: {
		badge: "bg-status-danger/10 text-status-danger-foreground",
		dot: "bg-status-danger",
	},
	info: {
		badge: "bg-status-info/10 text-status-info-foreground",
		dot: "bg-status-info",
	},
	neutral: {
		badge: "bg-status-neutral/10 text-status-neutral-foreground",
		dot: "bg-status-neutral",
	},
	success: {
		badge: "bg-status-success/10 text-status-success-foreground",
		dot: "bg-status-success",
	},
	warning: {
		badge: "bg-status-warning/10 text-status-warning-foreground",
		dot: "bg-status-warning",
	},
};

const STATUS_TONES: Record<string, Tone> = {
	escalate: "danger",
	in_progress: "neutral",
	open: "info",
	resolved: "success",
};

const PRIORITY_TONES: Record<ExceptionPriority, Tone> = {
	high: "danger",
	low: "neutral",
	medium: "warning",
};

function ToneBadge({
	tone,
	children,
}: {
	tone: Tone;
	children: React.ReactNode;
}) {
	return (
		<Badge className={TONE_CLASSES[tone].badge}>
			<span
				aria-hidden="true"
				className={cn("size-1.5 rounded-full", TONE_CLASSES[tone].dot)}
			/>
			{children}
		</Badge>
	);
}

export function StatusBadge({ status }: { status: ExceptionStatus }) {
	// Anything we don't recognise should still draw attention.
	return (
		<ToneBadge tone={STATUS_TONES[status] ?? "warning"}>
			{STATUS_LABELS[status]}
		</ToneBadge>
	);
}

export function PriorityBadge({ priority }: { priority: ExceptionPriority }) {
	return (
		<ToneBadge tone={PRIORITY_TONES[priority]}>
			{PRIORITY_LABELS[priority]}
		</ToneBadge>
	);
}
