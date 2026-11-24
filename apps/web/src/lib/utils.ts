import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register the product tokens from src/index.css so cn() resolves conflicts correctly
// (otherwise `text-meta` is read as a color and dropped next to `text-muted-foreground`).
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			radius: ["control", "surface"],
			spacing: ["page", "row", "stack"],
			text: ["title", "body", "meta"],
		},
	},
});

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
