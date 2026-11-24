import type {
	ExceptionPriority,
	ExceptionStatus,
	ExceptionType,
} from "@wrk-live-deseng/api/exceptions/model";

export const STATUS_LABELS: Record<ExceptionStatus, string> = {
	escalated: "Escalated",
	in_progress: "In progress",
	open: "Open",
	resolved: "Resolved",
};

export const PRIORITY_LABELS: Record<ExceptionPriority, string> = {
	high: "High",
	low: "Low",
	medium: "Medium",
};

export const TYPE_LABELS: Record<ExceptionType, string> = {
	damaged_goods: "Damaged goods",
	late_shipment: "Late shipment",
	missing_paperwork: "Missing paperwork",
	price_mismatch: "Price mismatch",
	wrong_item: "Wrong item",
};
