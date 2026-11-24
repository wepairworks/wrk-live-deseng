import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { RoleSwitcher } from "./role-switcher";

export default function Header() {
	return (
		<header className="flex items-center justify-between gap-4 border-b px-page py-3">
			<Link className="font-heading font-semibold text-body" href="/">
				Order Exceptions
			</Link>
			<div className="flex items-center gap-2">
				<RoleSwitcher />
				<ModeToggle />
			</div>
		</header>
	);
}
