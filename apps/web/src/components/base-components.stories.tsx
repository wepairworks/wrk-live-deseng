import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";

// coss ui primitives the inbox is built from. Full docs: https://coss.com/ui/docs
const meta = {
	title: "Base components",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Button>Default</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
			<Button loading>Loading</Button>
			<Button disabled>Disabled</Button>
		</div>
	),
};

export const Badges: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge>Default</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="info">Info</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="error">Error</Badge>
		</div>
	),
};

export const Avatars: Story = {
	render: () => (
		<div className="flex gap-2">
			<Avatar>
				<AvatarFallback>AR</AvatarFallback>
			</Avatar>
			<Avatar className="[--avatar-size:1.25rem]">
				<AvatarFallback>PS</AvatarFallback>
			</Avatar>
		</div>
	),
};

export const CheckboxStates: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<Label>
				<Checkbox /> Unchecked
			</Label>
			<Label>
				<Checkbox defaultChecked /> Checked
			</Label>
			<Label>
				<Checkbox indeterminate /> Indeterminate
			</Label>
			<Label>
				<Checkbox disabled /> Disabled
			</Label>
		</div>
	),
};

export const TooltipOnButton: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger render={<Button variant="outline" />}>
				Hover me
			</TooltipTrigger>
			<TooltipPopup>Copy order number</TooltipPopup>
		</Tooltip>
	),
};
