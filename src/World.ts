import Storage from "./Storage"
import Registry from "./Registry"
import Theme from "./Theme"
import { BlockValue, BlockRecord } from "./Block"
import { CanvasStore } from "./Canvas"
import { ContextMenuStore } from "./ContextMenu"
import { PortStore } from "./Port"

class World {
  BlockStorage = new Storage() as Storage<BlockValue>
  BlockRegistry = new Registry() as Registry<BlockValue>
  CanvasStore = new CanvasStore()
  Theme = new Theme()
  ContextMenuStore = new ContextMenuStore()
  PortStore = new PortStore()
}

const ThisWorld = new World()
window["World"] = ThisWorld

export default ThisWorld
