import Storage from "./Storage"
import { BlockValue } from "./Block"

class World {
  BlockStorage = new Storage("Record") as Storage<BlockValue>
}

export default new World()
