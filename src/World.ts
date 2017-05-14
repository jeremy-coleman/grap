import Storage from "./Storage"
import Registry from "./Registry"
import { SelectionStore } from "./Selection"
import { BlockValue, BlockRecord } from "./Block"

class World {
  BlockStorage = new Storage() as Storage<BlockValue>
  BlockRegistry = new Registry() as Registry<BlockValue>
  SelectionStore = new SelectionStore()
}

const ThisWorld = new World()
window["World"] = ThisWorld

export default ThisWorld
