import Storage from "./Storage"
import Registry from "./Registry"
import Theme from "./Theme"
import { SelectionStore } from "./Selection"
import { BlockValue, BlockRecord } from "./Block"
import Perspective from "./Perspective"

class World {
  BlockStorage = new Storage() as Storage<BlockValue>
  BlockRegistry = new Registry() as Registry<BlockValue>
  SelectionStore = new SelectionStore()
  Theme = new Theme()
  PerspectiveStore = Perspective.perspectiveStore()
}

const ThisWorld = new World()
window["World"] = ThisWorld

export default ThisWorld
