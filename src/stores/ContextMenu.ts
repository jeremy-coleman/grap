import { Value } from "reactive-magic"
import { Point } from "../utils/types"

export interface ContextMenuClosed {
	open: false
}

export interface ContextMenuOpen {
	open: true
	where: Point
}

export type ContextMenuState = ContextMenuClosed | ContextMenuOpen

export default class ContextMenuStore extends Value<ContextMenuState> {
	constructor() {
		super({ open: false })
	}

	close() {
		if (this.get().open) {
			this.set({ open: false })
		}
	}
}
