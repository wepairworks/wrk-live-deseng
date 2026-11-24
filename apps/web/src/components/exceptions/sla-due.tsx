import { cn } from "@/lib/utils";

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function formatDuration(ms: number): string {
	if (ms < HOUR_MS) {
		return `${Math.max(1, Math.round(ms / MINUTE_MS))}m`;
	}
	if (ms < DAY_MS) {
		return `${Math.round(ms / HOUR_MS)}h`;
	}
	return `${Math.round(ms / DAY_MS)}d`;
}

interface SlaDueProps {
	/** Epoch ms to measure against. Defaults to the current time. */
	now?: number;
	/** ISO timestamp */
	slaDueAt: string;
}

/** Time left on the SLA, or how late it is. Overdue is stated in words, not only in color. */
export function SlaDue({ slaDueAt, now = Date.now() }: SlaDueProps) {
	const remainingMs = Date.parse(slaDueAt) - now;
	const isOverdue = remainingMs < 0;
	const duration = formatDuration(Math.abs(remainingMs));

	return (
		<time
			className={cn(
				"text-meta tabular-nums",
				isOverdue
					? "font-medium text-status-danger-foreground"
					: "text-muted-foreground"
			)}
			dateTime={slaDueAt}
			title={new Date(slaDueAt).toLocaleString()}
		>
			{isOverdue ? `Overdue by ${duration}` : `Due in ${duration}`}
		</time>
	);
}
