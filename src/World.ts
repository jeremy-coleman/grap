import Storage from "./core/Storage"
import Registry from "./core/Registry"
import Theme from "./Theme"
import { BlockValue } from "./records/Block"
import CanvasStore from "./stores/Canvas"
import ContextMenuStore from "./stores/ContextMenu"
import PortStore from "./stores/Port"

class World {
	BlockStorage = new Storage() as Storage<BlockValue>
	BlockRegistry = new Registry() as Registry<BlockValue>
	CanvasStore = new CanvasStore()
	Theme = new Theme()
	ContextMenuStore = new ContextMenuStore()
	PortStore = new PortStore()

	zIndex = {
		bg: 0,
		selectionBox: 1,
		edge: 2,
		block: 3,
		port: 5,
	}
}

const ThisWorld = new World()
window["World"] = ThisWorld

export default ThisWorld
