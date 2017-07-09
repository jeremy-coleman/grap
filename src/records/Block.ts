import Record from "../core/Record"
import World from "../World"
import { Point } from "../utils/types"

export interface BlockValue {
	id: string
	origin: Point
	height: number
	width: number
}

// A BlockRecord is persisted to localStorage and when a block is created,
// it registers itself with the BlockRegistry.
export default class BlockRecord extends Record<BlockValue> {
	static async load(): Promise<Array<BlockRecord>> {
		const blocks = await World.BlockStorage.getAll()
		const records = blocks.map(block => new BlockRecord(block))
		return records
	}

	constructor(value: BlockValue) {
		super(value, World.BlockStorage, World.BlockRegistry)
	}
}
