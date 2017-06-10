import uuid from "uuid/v4"
import { Point } from "./utils"
import World from "./World"
import { BlockRecord } from "./Block"

export function createBlock(origin: Point) {
  const record = new BlockRecord({
    id: uuid(),
    height: 50,
    width: 50,
    origin,
  })
  record.save()
  World.CanvasStore.selectedBlocks.set([record])
}
