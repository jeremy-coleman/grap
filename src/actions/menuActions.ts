import * as blockActions from "./blockActions"
import * as selectionActions from "./selectionActions"
import World from "../World"

interface MenuAction {
	name: string
	action: () => void
	valid: () => boolean
}

const menuActions: Array<MenuAction> = []

menuActions.push({
	name: "Create Block",
	action: blockActions.createBlock,
	valid: () => World.CanvasStore.selectedBlocks.get().length === 0,
})

menuActions.push({
	name: "Delete Selection",
	action: selectionActions.deleteSelection,
	valid: () => World.CanvasStore.selectedBlocks.get().length > 0,
})

export default menuActions
