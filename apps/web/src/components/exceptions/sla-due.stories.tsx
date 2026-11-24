import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SlaDue } from "./sla-due";

const NOW = Date.parse("2026-11-24T12:00:00Z");

const meta = {
	args: { now: NOW, slaDueAt: "2026-11-24T18:00:00Z" },
	component: SlaDue,
	title: "Exceptions/SlaDue",
} satisfies Meta<typeof SlaDue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Upcoming: Story = {};

export const Overdue: Story = {
	args: { slaDueAt: "2026-11-24T09:00:00Z" },
};
