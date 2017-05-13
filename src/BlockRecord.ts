import Record from "./Record"
import World from "./World"
import { BlockValue } from "./Block"

export default class BlockRecord extends Record<BlockValue> {

  static create(value: BlockValue) {
    const record = new BlockRecord(value)
    Record.save(value, World.RecordStorage)
    return record
  }

  constructor(value: BlockValue) {
    super(value, World.RecordStorage)
  }

  static async load(): Promise<Array<BlockRecord>> {
    const blocks = await World.RecordStorage.getAll()
    const records = blocks.map(block => new BlockRecord(block))
    return records
  }

}
