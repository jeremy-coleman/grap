import { Value } from "reactive-magic"
import { Point } from "../utils/types"

export interface DraggableState {
	down: boolean
	start?: Point
	end?: Point
}

export default class DraggableStore extends Value<DraggableState> {
	constructor() {
		super({ down: false, start: null, end: null })
	}
}
