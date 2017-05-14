import Storage from "./Storage"
import Registry from "./Registry"
import { BlockValue, BlockRecord } from "./Block"

class World {
  BlockStorage = new Storage() as Storage<BlockValue>
  BlockRegistry = new Registry() as Registry<BlockValue>
}

export default new World()
