// Client-safe domain model for the Order Exceptions inbox. No server imports here:
// the web app imports these constants directly.

export const EXCEPTION_STATUSES = [
	"open",
	"in_progress",
	"escalated",
	"resolved",
] as const;
export type ExceptionStatus = (typeof EXCEPTION_STATUSES)[number];

export const EXCEPTION_PRIORITIES = ["low", "medium", "high"] as const;
export type ExceptionPriority = (typeof EXCEPTION_PRIORITIES)[number];

export const EXCEPTION_TYPES = [
	"late_shipment",
	"wrong_item",
	"price_mismatch",
	"damaged_goods",
	"missing_paperwork",
] as const;
export type ExceptionType = (typeof EXCEPTION_TYPES)[number];

export interface TeamMember {
	/** The exception type this person handles most often. The mock AI uses it. */
	focus: ExceptionType;
	id: string;
	initials: string;
	name: string;
}

export const TEAM: readonly TeamMember[] = [
	{
		focus: "price_mismatch",
		id: "tm_alex",
		initials: "AR",
		name: "Alex Rivera",
	},
	{
		focus: "late_shipment",
		id: "tm_priya",
		initials: "PS",
		name: "Priya Shah",
	},
	{ focus: "wrong_item", id: "tm_marcus", initials: "ML", name: "Marcus Lee" },
	{
		focus: "damaged_goods",
		id: "tm_sofia",
		initials: "SM",
		name: "Sofía Morales",
	},
	{
		focus: "missing_paperwork",
		id: "tm_jordan",
		initials: "JK",
		name: "Jordan Kim",
	},
	{
		focus: "late_shipment",
		id: "tm_noah",
		initials: "NB",
		name: "Noah Becker",
	},
];

/** The signed-in ops user. Every change made through the API is recorded as theirs. */
export const CURRENT_USER_ID = "tm_alex";

interface BaseEvent {
	/** Team member who caused the event; null for system events. */
	actorId: string | null;
	/** ISO timestamp */
	at: string;
	id: string;
}

export type ExceptionEvent =
	| (BaseEvent & { kind: "created" })
	| (BaseEvent & { kind: "assigned"; assigneeId: string | null })
	| (BaseEvent & {
			kind: "status_changed";
			from: ExceptionStatus;
			to: ExceptionStatus;
	  })
	| (BaseEvent & { kind: "comment"; body: string });

export interface OrderException {
	assigneeId: string | null;
	/** ISO timestamp */
	createdAt: string;
	customer: string;
	/** Oldest first */
	history: ExceptionEvent[];
	id: string;
	orderNumber: string;
	priority: ExceptionPriority;
	/** ISO timestamp */
	slaDueAt: string;
	status: ExceptionStatus;
	summary: string;
	type: ExceptionType;
	/** ISO timestamp of the latest history event */
	updatedAt: string;
}

export interface AssigneeSuggestion {
	assigneeId: string;
	/** 0–1 */
	confidence: number;
	exceptionId: string;
	reason: string;
}
