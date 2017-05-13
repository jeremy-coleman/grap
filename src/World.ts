import Storage from "./Storage"
import { BlockValue } from "./Block"

class World {
  RecordStorage: Storage<BlockValue> = new Storage("Record")
}

export default new World()
