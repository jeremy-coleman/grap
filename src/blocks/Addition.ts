import { NumberInput, NumberOutput, FunctionBlock } from "./core"

interface AdditionInput {
	x: NumberInput | NumberOutput
	y: NumberInput | NumberOutput
}

interface AdditionOutput {
	sum: NumberOutput
}

export default class AdditionBlock extends FunctionBlock<
	AdditionInput,
	AdditionOutput
> {
	input = {
		x: new NumberInput(0),
		y: new NumberInput(0),
	}
	output = {
		sum: new NumberOutput(() => this.input.x.get() + this.input.y.get()),
	}
}
