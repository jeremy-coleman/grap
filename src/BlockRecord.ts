import Record from "./Record"
import World from "./World"
import { BlockValue } from "./Block"

export default class BlockRecord extends Record<BlockValue> {

  static create(value: BlockValue) {
    const record = new BlockRecord(value)
    Record.save(value, World.BlockStorage)
    return record
  }

  constructor(value: BlockValue) {
    super(value, World.BlockStorage)
  }

  static async load(): Promise<Array<BlockRecord>> {
    const blocks = await World.BlockStorage.getAll()
    const records = blocks.map(block => new BlockRecord(block))
    return records
  }

}
