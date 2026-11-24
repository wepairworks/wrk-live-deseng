import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { OrderException } from "@wrk-live-deseng/api/exceptions/model";

import { ExceptionDrawer } from "./exception-drawer";

const EXCEPTION: OrderException = {
	assigneeId: "tm_priya",
	createdAt: "2026-11-24T08:00:00Z",
	customer: "Northwind Supply",
	history: [
		{
			actorId: null,
			at: "2026-11-24T08:00:00Z",
			id: "EXC-1001-1",
			kind: "created",
		},
		{
			actorId: "tm_alex",
			assigneeId: "tm_priya",
			at: "2026-11-24T08:30:00Z",
			id: "EXC-1001-2",
			kind: "assigned",
		},
		{
			actorId: "tm_priya",
			at: "2026-11-24T09:00:00Z",
			from: "open",
			id: "EXC-1001-3",
			kind: "status_changed",
			to: "in_progress",
		},
		{
			actorId: "tm_priya",
			at: "2026-11-24T11:00:00Z",
			from: "in_progress",
			id: "EXC-1001-4",
			kind: "status_changed",
			to: "escalated",
		},
	],
	id: "EXC-1001",
	orderNumber: "SO-51234",
	priority: "high",
	slaDueAt: "2026-11-24T16:00:00Z",
	status: "escalated",
	summary: "Carrier missed the pickup window",
	type: "late_shipment",
	updatedAt: "2026-11-24T11:00:00Z",
};

const meta = {
	args: { exception: EXCEPTION, onOpenChange: () => undefined, open: true },
	component: ExceptionDrawer,
	title: "Exceptions/ExceptionDrawer",
} satisfies Meta<typeof ExceptionDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
