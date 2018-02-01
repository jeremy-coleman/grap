import { Value } from "reactive-magic"
import { Point } from "../utils/types"

export interface DraggableUp {
	down: false
}

export interface DraggableDown {
	down: true
	start: Point
	end: Point
}

export type DraggableState = DraggableUp | DraggableDown

export default class DraggableStore extends Value<DraggableState> {
	constructor() {
		super({ down: false })
	}
}
