import uuid from "uuid/v4"
import { Point } from "./utils"
import World from "./World"
import { BlockRecord } from "./Block"

interface MenuAction {
  name: string
  action: () => void
  valid: () => boolean
}

const MenuActions: Array<MenuAction> = []

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

MenuActions.push({
  name: "Create Block",
  action: createBlock,
  valid: () => true,
})

export function deleteSelection() {
  World.CanvasStore.selectedBlocks.get().forEach(block => block.delete())
  World.CanvasStore.selectedBlocks.set([])
}

MenuActions.push({
  name: "Delete Selection",
  action: deleteSelection,
  valid: () => World.CanvasStore.selectedBlocks.get().length > 0,
})

export default MenuActions
