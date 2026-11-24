import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
	EXCEPTION_PRIORITIES,
	EXCEPTION_STATUSES,
} from "@wrk-live-deseng/api/exceptions/model";

import { PriorityBadge, StatusBadge } from "./exception-badges";

const meta = {
	args: { status: "open" },
	argTypes: { status: { control: "select", options: [...EXCEPTION_STATUSES] } },
	component: StatusBadge,
	title: "Exceptions/Badges",
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Status: Story = {};

export const AllStatuses: Story = {
	render: () => (
		<div className="flex gap-2">
			{EXCEPTION_STATUSES.map((status) => (
				<StatusBadge key={status} status={status} />
			))}
		</div>
	),
};

export const AllPriorities: Story = {
	render: () => (
		<div className="flex gap-2">
			{EXCEPTION_PRIORITIES.map((priority) => (
				<PriorityBadge key={priority} priority={priority} />
			))}
		</div>
	),
};
