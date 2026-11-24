import { setTimeout as sleep } from "node:timers/promises";

import { ORPCError } from "@orpc/server";
import z from "zod";
import { EXCEPTION_STATUSES, TEAM } from "../exceptions/model";
import {
	listExceptions,
	suggestAssignee,
	updateException,
} from "../exceptions/store";
import { o, publicProcedure } from "../index";

// Mock network conditions. Raise MOCK_FAILURE_RATE to 1 to make every call fail.
const MOCK_LATENCY_MS = { max: 1200, min: 300 } as const;
const MOCK_FAILURE_RATE = 0.1;

const mockNetwork = o.middleware(async ({ next }) => {
	const delay =
		MOCK_LATENCY_MS.min +
		Math.random() * (MOCK_LATENCY_MS.max - MOCK_LATENCY_MS.min);
	await sleep(delay);
	if (Math.random() < MOCK_FAILURE_RATE) {
		throw new ORPCError("SERVICE_UNAVAILABLE", {
			message: "Mock API failure. Try again.",
		});
	}
	return next();
});

const mockProcedure = publicProcedure.use(mockNetwork);

const teamMemberId = z
	.string()
	.refine((id) => TEAM.some((member) => member.id === id), {
		message: "Unknown team member",
	});

export const exceptionsRouter = {
	list: mockProcedure.handler(() => listExceptions()),
	update: mockProcedure
		.input(
			z.object({
				assigneeId: teamMemberId.nullable().optional(),
				id: z.string(),
				status: z.enum(EXCEPTION_STATUSES).optional(),
			})
		)
		.handler(({ input: { id, ...patch } }) => {
			const updated = updateException(id, patch);
			if (!updated) {
				throw new ORPCError("NOT_FOUND", {
					message: `Exception ${id} not found`,
				});
			}
			return updated;
		}),
};

export const aiRouter = {
	suggestAssignee: mockProcedure
		.input(z.object({ id: z.string() }))
		.handler(({ input }) => {
			const suggestion = suggestAssignee(input.id);
			if (!suggestion) {
				throw new ORPCError("NOT_FOUND", {
					message: `Exception ${input.id} not found`,
				});
			}
			return suggestion;
		}),
};
