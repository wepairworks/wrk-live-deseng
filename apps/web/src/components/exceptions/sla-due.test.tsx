import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { SlaDue } from "./sla-due";

const NOW = Date.parse("2026-11-24T12:00:00Z");

test("states an overdue SLA in words, not only in color", () => {
	render(<SlaDue now={NOW} slaDueAt="2026-11-24T09:00:00Z" />);

	expect(screen.getByText("Overdue by 3h")).toHaveAttribute(
		"datetime",
		"2026-11-24T09:00:00Z"
	);
});

test("shows the time left on an upcoming SLA", () => {
	render(<SlaDue now={NOW} slaDueAt="2026-11-26T12:00:00Z" />);

	expect(screen.getByText("Due in 2d")).toBeInTheDocument();
});
