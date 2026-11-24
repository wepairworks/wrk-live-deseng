"use client";

import type { OrderException } from "@wrk-live-deseng/api/exceptions/model";

import {
	Drawer,
	DrawerDescription,
	DrawerHeader,
	DrawerPanel,
	DrawerPopup,
	DrawerTitle,
} from "@/components/ui/drawer";

interface ExceptionDrawerProps {
	exception: OrderException | undefined;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

/** Detail drawer. Header only so far; the panel is where details and the workflow timeline go. */
export function ExceptionDrawer({
	exception,
	open,
	onOpenChange,
}: ExceptionDrawerProps) {
	return (
		<Drawer onOpenChange={onOpenChange} open={open} position="right">
			<DrawerPopup showCloseButton>
				<DrawerHeader>
					<DrawerTitle>{exception?.orderNumber}</DrawerTitle>
					<DrawerDescription>
						{exception ? `${exception.id} · ${exception.customer}` : null}
					</DrawerDescription>
				</DrawerHeader>
				<DrawerPanel />
			</DrawerPopup>
		</Drawer>
	);
}
