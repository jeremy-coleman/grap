import * as React from "react"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import Record, { RecordValue } from "./Record"
import World from "./World"
import Draggable, { DraggableState } from "./Draggable"
import { Point } from "./utils"
import Port from "./Port"

interface BlockProps {
  record: BlockRecord
}

const snapSize = 1

export default class Block extends Component<BlockProps> {
  // Compute the origin of the block. If the block is selected, account
  // for dragging it as well.
  static computeOrigin(record: BlockRecord, store: DraggableState): Point {
    const selected = World.CanvasStore.blockIsSelected(record)
    const { down } = store
    const { origin } = record.get()
    if (selected && down) {
      const start = World.CanvasStore.transformPoint(store.start)
      const end = World.CanvasStore.transformPoint(store.end)
      return {
        x: Math.round((origin.x + (end.x - start.x)) / snapSize) * snapSize,
        y: Math.round((origin.y + (end.y - start.y)) / snapSize) * snapSize,
      }
    } else {
      return origin
    }
  }

  // If the block is not selected when we start dragging it, then it
  // should be the only selected block.
  handleDragStart = (store: DraggableState) => {
    World.ContextMenuStore.close()
    if (!World.CanvasStore.blockIsSelected(this.props.record)) {
      World.CanvasStore.selectedBlocks.set([this.props.record])
    }
  }

  // If a drag ends without moving, its essentially a click
  didntMove(store: DraggableState) {
    return store.start.x === store.end.x && store.start.y === store.end.y
  }

  // If we clicked a block, then select it, otherwise, update the positions
  // of all selected blocks.
  handleDragEnd = (store: DraggableState) => {
    if (this.didntMove(store)) {
      World.CanvasStore.selectedBlocks.set([this.props.record])
    } else {
      World.CanvasStore.selectedBlocks.get().forEach(record => {
        record.assign({
          origin: Block.computeOrigin(record, store),
        })
      })
    }
  }

  getStyle(store: DraggableState): React.CSSProperties {
    const origin = Block.computeOrigin(this.props.record, store)
    const { height, width } = this.props.record.get()
    const selected = World.CanvasStore.blockIsSelected(this.props.record)
    const primary = World.Theme.primary.get()
    const border = World.Theme.border.get()
    return {
      width,
      height,
      border: `2px solid ${selected ? primary : border}`,
      borderRadius: 3,
      backgroundColor: World.Theme.block.get(),
      position: "absolute",
      transform: `translate3d(${origin.x}px,${origin.y}px, 0)`,
      boxSizing: "border-box",
    }
  }

  view() {
    return (
      <Draggable
        draggableStore={World.CanvasStore.draggableStore}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        view={(store, handlers) =>
          <div style={this.getStyle(store)} {...handlers}>
            <Port id={this.props.record.id + "port"} />
          </div>}
      />
    )
  }
}

export interface BlockValue {
  id: string
  origin: Point
  height: number
  width: number
}

// A BlockRecord is persisted to localStorage and when a block is created,
// it registers itself with the BlockRegistry.
export class BlockRecord extends Record<BlockValue> {
  static async load(): Promise<Array<BlockRecord>> {
    const blocks = await World.BlockStorage.getAll()
    const records = blocks.map(block => new BlockRecord(block))
    return records
  }

  constructor(value: BlockValue) {
    super(value, World.BlockStorage, World.BlockRegistry)
  }
}
