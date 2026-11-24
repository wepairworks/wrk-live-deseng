"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/components/ui/menu";

export function ModeToggle() {
	const { setTheme } = useTheme();

	return (
		<Menu>
			<MenuTrigger render={<Button size="icon-sm" variant="outline" />}>
				<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span className="sr-only">Toggle theme</span>
			</MenuTrigger>
			<MenuPopup align="end">
				<MenuItem onClick={() => setTheme("light")}>Light</MenuItem>
				<MenuItem onClick={() => setTheme("dark")}>Dark</MenuItem>
				<MenuItem onClick={() => setTheme("system")}>System</MenuItem>
			</MenuPopup>
		</Menu>
	);
}
