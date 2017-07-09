import { NumberInput, DataBlock } from "./core"

interface PointInput {
	x: NumberInput
	y: NumberInput
}

export default class Point2D extends DataBlock<PointInput> {
	input = {
		x: new NumberInput(0),
		y: new NumberInput(0),
	}
}
