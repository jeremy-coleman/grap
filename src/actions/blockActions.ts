import uuid from "uuid/v4"
import World from "../World"
import BlockRecord from "../records/Block"

export function createBlock() {
	const { where } = World.ContextMenuStore.get()
	const origin = where
		? World.CanvasStore.transformPoint(where)
		: World.CanvasStore.centerOfView()
	const record = new BlockRecord({
		id: uuid(),
		height: 50,
		width: 50,
		origin,
	})
	record.save()
	World.CanvasStore.selectedBlocks.set([record])
}
