import uuid from "uuid/v4"
import World from "../World"
import BlockRecord from "../records/Block"

export function createBlock() {
	const state = World.ContextMenuStore.get()
	if (!state.open) {
		return
	}
	const where = state.where
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
