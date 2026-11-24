"use client";

import { ROLE_LABELS, ROLES, useRole } from "@/components/role-provider";
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ROLE_ITEMS = ROLES.map((role) => ({
	label: ROLE_LABELS[role],
	value: role,
}));

export function RoleSwitcher() {
	const { role, setRole } = useRole();

	return (
		<Select
			items={ROLE_ITEMS}
			onValueChange={(value) => {
				if (value) {
					setRole(value);
				}
			}}
			value={role}
		>
			<SelectTrigger aria-label="Role" className="w-32" size="sm">
				<SelectValue />
			</SelectTrigger>
			<SelectPopup>
				{ROLE_ITEMS.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectPopup>
		</Select>
	);
}
