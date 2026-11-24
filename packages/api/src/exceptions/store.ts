import {
	type AssigneeSuggestion,
	CURRENT_USER_ID,
	EXCEPTION_TYPES,
	type ExceptionEvent,
	type ExceptionPriority,
	type ExceptionStatus,
	type ExceptionType,
	type OrderException,
	TEAM,
} from "./model";

const SEED = 20_261_124;
const LCG_MODULUS = 2_147_483_647;
const LCG_MULTIPLIER = 48_271;
const EXCEPTION_COUNT = 200;
const HOUR_MS = 3_600_000;
const MAX_AGE_HOURS = 48;

const SLA_HOURS: Record<ExceptionPriority, number> = {
	high: 8,
	low: 48,
	medium: 24,
};

/** Status changes an exception went through to reach its current status. */
const STATUS_PATHS: Record<ExceptionStatus, readonly ExceptionStatus[]> = {
	escalated: ["in_progress", "escalated"],
	in_progress: ["in_progress"],
	open: [],
	resolved: ["in_progress", "resolved"],
};

const CUSTOMERS = [
	"Northwind Supply",
	"Blue Ridge Hardware",
	"Cascadia Foods",
	"Summit Medical Supply",
	"Lakeside Restaurant Group",
	"Pioneer Builders",
	"Redwood Office Co.",
	"Granite State Electric",
	"Coastal Marine Parts",
	"Prairie Ag Co-op",
	"Metro Hospitality",
	"Evergreen Labs",
] as const;

const SUMMARIES: Record<ExceptionType, readonly string[]> = {
	damaged_goods: [
		"Pallet arrived crushed",
		"Two cartons water damaged",
		"Glassware broken in transit",
	],
	late_shipment: [
		"Carrier missed the pickup window",
		"Shipment stuck at the regional hub",
		"Backordered line is holding the whole order",
	],
	missing_paperwork: [
		"Missing certificate of origin",
		"No packing slip in the shipment",
		"Hazmat sheet not attached",
	],
	price_mismatch: [
		"Invoice price is above the contract price",
		"Volume discount not applied",
		"Freight charged on a free-shipping account",
	],
	wrong_item: [
		"Received 40 mm fittings instead of 50 mm",
		"Wrong color variant shipped",
		"SKU swapped at the pick station",
	],
};

const COMMENTS = [
	"Called the customer, waiting on photos.",
	"Carrier opened a claim.",
	"Finance is checking the contract terms.",
	"Customer would rather have a credit than a reship.",
] as const;

/** Park–Miller LCG: tiny seeded PRNG so every server start sees the same data. */
function createRandom(seed: number): () => number {
	let state = seed % LCG_MODULUS;
	return () => {
		state = (state * LCG_MULTIPLIER) % LCG_MODULUS;
		return state / LCG_MODULUS;
	};
}

function pick<T>(random: () => number, items: readonly T[]): T {
	const item = items[Math.floor(random() * items.length)];
	if (item === undefined) {
		throw new Error("pick() needs a non-empty list");
	}
	return item;
}

function pickPriority(roll: number): ExceptionPriority {
	if (roll < 0.25) {
		return "high";
	}
	return roll < 0.65 ? "medium" : "low";
}

function pickStatus(roll: number): ExceptionStatus {
	if (roll < 0.4) {
		return "open";
	}
	if (roll < 0.7) {
		return "in_progress";
	}
	return roll < 0.85 ? "escalated" : "resolved";
}

function seedException(
	random: () => number,
	index: number,
	now: number
): OrderException {
	const id = `EXC-${1001 + index}`;
	const type = pick(random, EXCEPTION_TYPES);
	const priority = pickPriority(random());
	const status = pickStatus(random());
	const createdMs =
		now - Math.round((0.5 + random() * (MAX_AGE_HOURS - 0.5)) * HOUR_MS);
	const assigneeId =
		status === "open" && random() < 0.5 ? null : pick(random, TEAM).id;

	let cursor = createdMs;
	// Each event lands somewhere between the previous event and now, so history stays ordered.
	const nextAt = (): string => {
		cursor += Math.round(random() * (now - cursor) * 0.4);
		return new Date(cursor).toISOString();
	};
	const eventId = (): string => `${id}-${history.length + 1}`;

	const history: ExceptionEvent[] = [
		{
			actorId: null,
			at: new Date(createdMs).toISOString(),
			id: `${id}-1`,
			kind: "created",
		},
	];
	if (assigneeId) {
		history.push({
			actorId: pick(random, TEAM).id,
			assigneeId,
			at: nextAt(),
			id: eventId(),
			kind: "assigned",
		});
	}
	let previous: ExceptionStatus = "open";
	for (const next of STATUS_PATHS[status]) {
		history.push({
			actorId: assigneeId,
			at: nextAt(),
			from: previous,
			id: eventId(),
			kind: "status_changed",
			to: next,
		});
		previous = next;
	}
	if (random() < 0.3) {
		history.push({
			actorId: assigneeId ?? pick(random, TEAM).id,
			at: nextAt(),
			body: pick(random, COMMENTS),
			id: eventId(),
			kind: "comment",
		});
	}

	return {
		assigneeId,
		createdAt: new Date(createdMs).toISOString(),
		customer: pick(random, CUSTOMERS),
		history,
		id,
		orderNumber: `SO-${48_000 + Math.floor(random() * 9000)}`,
		priority,
		slaDueAt: new Date(createdMs + SLA_HOURS[priority] * HOUR_MS).toISOString(),
		status,
		summary: pick(random, SUMMARIES[type]),
		type,
		updatedAt: history.at(-1)?.at ?? new Date(createdMs).toISOString(),
	};
}

const seedRandom = createRandom(SEED);
const seededAt = Date.now();
// shortcut: in-memory store, reset on every server restart or hot reload. Move to packages/db if state must persist.
const store = new Map(
	Array.from({ length: EXCEPTION_COUNT }, (_, index) => {
		const exception = seedException(seedRandom, index, seededAt);
		return [exception.id, exception] as const;
	})
);

export function listExceptions(): OrderException[] {
	return [...store.values()];
}

export interface ExceptionPatch {
	assigneeId?: string | null;
	status?: ExceptionStatus;
}

/** Applies the patch and records a history event per changed field. Returns undefined for unknown ids. */
export function updateException(
	id: string,
	patch: ExceptionPatch
): OrderException | undefined {
	const current = store.get(id);
	if (!current) {
		return;
	}

	const at = new Date().toISOString();
	const next: OrderException = { ...current, history: [...current.history] };

	if (
		patch.assigneeId !== undefined &&
		patch.assigneeId !== current.assigneeId
	) {
		next.assigneeId = patch.assigneeId;
		next.history.push({
			actorId: CURRENT_USER_ID,
			assigneeId: patch.assigneeId,
			at,
			id: `${id}-${next.history.length + 1}`,
			kind: "assigned",
		});
	}
	if (patch.status !== undefined && patch.status !== current.status) {
		next.status = patch.status;
		next.history.push({
			actorId: CURRENT_USER_ID,
			at,
			from: current.status,
			id: `${id}-${next.history.length + 1}`,
			kind: "status_changed",
			to: patch.status,
		});
	}
	if (next.history.length > current.history.length) {
		next.updatedAt = at;
	}

	store.set(id, next);
	return next;
}

const MIN_CONFIDENCE_SPECIALIST = 0.7;
const MIN_CONFIDENCE_FALLBACK = 0.35;
const CONFIDENCE_SPREAD = 0.25;

/** Mock AI: prefers the teammate who focuses on this exception type, then the lightest queue. */
export function suggestAssignee(id: string): AssigneeSuggestion | undefined {
	const exception = store.get(id);
	if (!exception) {
		return;
	}

	const [best] = TEAM.filter((member) => member.id !== exception.assigneeId)
		.map((member) => ({
			isSpecialist: member.focus === exception.type,
			load: listExceptions().filter(
				(item) => item.assigneeId === member.id && item.status !== "resolved"
			).length,
			member,
		}))
		.sort(
			(a, b) =>
				Number(b.isSpecialist) - Number(a.isSpecialist) || a.load - b.load
		);
	if (!best) {
		return;
	}

	const typeLabel = exception.type.replaceAll("_", " ");
	const [firstName] = best.member.name.split(" ");
	const minConfidence = best.isSpecialist
		? MIN_CONFIDENCE_SPECIALIST
		: MIN_CONFIDENCE_FALLBACK;

	return {
		assigneeId: best.member.id,
		confidence:
			Math.round((minConfidence + Math.random() * CONFIDENCE_SPREAD) * 100) /
			100,
		exceptionId: id,
		reason: best.isSpecialist
			? `${firstName} handles most ${typeLabel} cases and has ${best.load} open items.`
			: `Nobody focuses on ${typeLabel} cases. ${firstName} has the lightest queue (${best.load} open).`,
	};
}
