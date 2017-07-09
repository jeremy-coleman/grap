import { Value } from "reactive-magic"
import { Point } from "../utils/types"

export interface ContextMenuState {
	open: boolean
	where: Point
}

export default class ContextMenuStore extends Value<ContextMenuState> {
	constructor() {
		super({ open: false, where: null })
	}

	close() {
		if (this.get().open) {
			this.set({ open: false, where: null })
		}
	}
}
