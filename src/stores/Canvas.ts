import { Value, DerivedValue } from "reactive-magic"
import { Point } from "../utils/types"
import DraggableStore from "./Draggable"
import BlockRecord from "../records/Block"

interface Perspective {
	x: number
	y: number
	zoom: number
}

export default class CanvasStore {
	draggableStore = new DraggableStore()

	selectedBlocks: Value<Array<BlockRecord>> = new Value([])

	blockIsSelected(record: BlockRecord) {
		return this.selectedBlocks.get().some(r => r.id === record.id)
	}

	selectionIsEmpty() {
		return this.selectedBlocks.get().length === 0
	}

	perspective: Value<Perspective> = new Value({
		x: 0,
		y: 0,
		zoom: 1,
	})

	rect: Value<ClientRect> = new Value({
		width: 1,
		height: 1,
		top: 0,
		left: 0,
		right: 1,
		bottom: 1,
	})

	centerOfView(): Point {
		const { top, height, width, left } = this.rect.get()
		return this.transformPoint({
			y: top + height / 2,
			x: left + width / 2,
		})
	}

	// Transform a point on the screen (from Draggable) to a point within a
	// rect, accounting for the perspective.
	transformPoint(point: Point): Point {
		// normalize x and y from [-0.5,0.5] with 0 at the center
		const { top, left, width, height } = this.rect.get()
		const centered = {
			x: (point.x - left) / width - 0.5,
			y: (point.y - top) / height - 0.5,
		}
		// zoom in at the center of the screen
		const { x, y, zoom } = this.perspective.get()
		const stretched = {
			x: centered.x / zoom,
			y: centered.y / zoom,
		}
		// map [-0.5,0.5] to [0,width] and [0,height]
		const cropped = {
			x: (stretched.x + 0.5) * width - x,
			y: (stretched.y + 0.5) * height - y,
		}
		return cropped
	}

	viewport: DerivedValue<ClientRect> = new DerivedValue(() => {
		const { top, left, bottom, right } = this.rect.get()
		const topLeft = this.transformPoint({ x: left, y: top })
		const bottomRight = this.transformPoint({ x: right, y: bottom })
		return {
			top: topLeft.y,
			left: topLeft.x,
			bottom: bottomRight.y,
			right: bottomRight.x,
			width: bottomRight.x - topLeft.x,
			height: bottomRight.y - topLeft.y,
		}
	})

	edge: Value<{ block: BlockRecord; end: Point } | undefined> = new Value(
		undefined
	)
}
