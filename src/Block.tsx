// A `Block` is a component that renders a `BlockRecord` which is a reactive
// object that holds a `BlockValue`, and persists it to BlockStorage and
// registers itself with a `BlockRegistry`.

import * as React from 'react'
import { Value } from 'reactive-magic'
import Component from 'reactive-magic/component'
import Record, { RecordValue } from "./Record"
import World from "./World"
import Draggable, { DraggableStore } from "./Draggable"

interface Point {
  x: number
  y: number
}

interface BlockProps {
  record: BlockRecord
}

export default class Block extends Component<BlockProps> {

  computeOrigin(store: DraggableStore): Point {
    const { down, start, end } = store
    const { origin } = this.props.record.get()
    if (down) {
      return {
        x: Math.round((origin.x + (end.x - start.x)) / 10) * 10,
        y: Math.round((origin.y + (end.y - start.y)) / 10) * 10,
      }
    } else {
      return origin
    }
  }

  handleDragEnd = (store: DraggableStore) => {
    const record = this.props.record.get()
    this.props.record.set({
      ...record,
      origin: this.computeOrigin(store)
    })
  }

  getStyle(store: DraggableStore): React.CSSProperties {
    const origin = this.computeOrigin(store)
    const { height, width } = this.props.record.get()
    const selected = World.SelectionStore.isSelected(this.props.record)
    return {
      width,
      height,
      border: `2px solid ${selected ? "red" : "black"}`,
      borderRadius: 3,
      backgroundColor: "#333333",
      position: "absolute",
      transform: `translate3d(${origin.x}px,${origin.y}px, 0)`,
      boxSizing: "border-box",
    }
  }

  view() {
    return (
      <Draggable
        onDragEnd={this.handleDragEnd}
        view={(store, handlers) =>
          <div
            style={this.getStyle(store)}
            {...handlers}
          />
        }
      />
    )
  }
}

export interface BlockValue {
  id: string
  origin: Point // rename to origin
  height: number
  width: number
}

export class BlockRecord extends Record<BlockValue> {

  static create(value: BlockValue) {
    const record = new BlockRecord(value)
    Record.save(value, World.BlockStorage)
    return record
  }

  static async load(): Promise<Array<BlockRecord>> {
    const blocks = await World.BlockStorage.getAll()
    const records = blocks.map(block => new BlockRecord(block))
    return records
  }

  constructor(value: BlockValue) {
    super(value, World.BlockStorage, World.BlockRegistry)
  }
}
