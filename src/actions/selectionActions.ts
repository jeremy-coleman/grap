import World from "../World"

export function deleteSelection() {
	World.CanvasStore.selectedBlocks.get().forEach(block => block.delete())
	World.CanvasStore.selectedBlocks.set([])
}
