"use client";

import { TEAM } from "@wrk-live-deseng/api/exceptions/model";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Menu,
	MenuPopup,
	MenuRadioGroup,
	MenuRadioItem,
	MenuTrigger,
} from "@/components/ui/menu";

interface AssigneeMenuProps {
	assigneeId: string | null;
	onAssign: (assigneeId: string) => void;
}

export function AssigneeMenu({ assigneeId, onAssign }: AssigneeMenuProps) {
	const assignee = TEAM.find((member) => member.id === assigneeId);

	return (
		<Menu>
			<MenuTrigger
				aria-label={`Assignee: ${assignee?.name ?? "Unassigned"}`}
				render={<Button size="sm" variant="ghost" />}
			>
				{assignee ? (
					<>
						<Avatar className="[--avatar-size:1.25rem]">
							<AvatarFallback>{assignee.initials}</AvatarFallback>
						</Avatar>
						{assignee.name}
					</>
				) : (
					<span className="text-muted-foreground">Unassigned</span>
				)}
			</MenuTrigger>
			<MenuPopup align="start">
				<MenuRadioGroup
					onValueChange={(value: string) => onAssign(value)}
					value={assigneeId ?? ""}
				>
					{TEAM.map((member) => (
						<MenuRadioItem closeOnClick key={member.id} value={member.id}>
							{member.name}
						</MenuRadioItem>
					))}
				</MenuRadioGroup>
			</MenuPopup>
		</Menu>
	);
}
