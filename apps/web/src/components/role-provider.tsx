"use client";

import { createContext, use, useState } from "react";

export const ROLES = ["operator", "manager", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
	admin: "Admin",
	manager: "Manager",
	operator: "Operator",
};

interface RoleContextValue {
	role: Role;
	setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

/** Mock role for the signed-in user. Switched from the header; not enforced by the API. */
export function RoleProvider({ children }: { children: React.ReactNode }) {
	const [role, setRole] = useState<Role>("operator");
	return <RoleContext value={{ role, setRole }}>{children}</RoleContext>;
}

export function useRole(): RoleContextValue {
	const context = use(RoleContext);
	if (!context) {
		throw new Error("useRole must be used inside <RoleProvider>");
	}
	return context;
}
