import * as React from "react"
import World from "./World"
import { Value } from 'reactive-magic'
import Component from 'reactive-magic/component'
import { BlockRecord } from "./Block"
import Draggable, { DraggableStore } from "./Draggable"

export class SelectionStore {

  public draggableStore = Draggable.store()

  private selected: Value<Array<BlockRecord>>
  constructor(selected: Array<BlockRecord> = []) {
    this.selected = new Value(selected)
  }

  get() {
    return this.selected.get()
  }

  set(value: Array<BlockRecord>) {
    this.selected.set(value)
  }

  isSelected(record: BlockRecord) {
    return this.selected.get().some(r => r.id === record.id)
  }

  isEmpty() {
    return this.selected.get().length === 0
  }
}

export default class Selection extends Component<{}> {

  updateSelection = (store: DraggableStore) => {
    if (store.down) {
      const blocks = World.BlockRegistry.get()
      const left = Math.min(store.start.x, store.end.x)
      const right = Math.max(store.start.x, store.end.x)
      const top = Math.min(store.start.y, store.end.y)
      const bottom = Math.max(store.start.y, store.end.y)
      const selected = blocks.filter(block => {
        const { height, width, origin: { x, y } } = block.get()
        const xAround = left < x && right > x
        const xInside = left > x && left < x + width
        const yAround = top < y && bottom > y
        const yInside = top > y && top < y + height
        return (xAround || xInside) && (yAround || yInside)
      })
      World.SelectionStore.set(selected)
    }
  }

  getSelectionStyle(store: DraggableStore): React.CSSProperties {
    return {
      width: Math.abs(store.start.x - store.end.x),
      height: Math.abs(store.start.y - store.end.y),
      border: "1px solid blue",
      borderRadius: 3,
      backgroundColor: "#0000BB",
      opacity: 0.2,
      position: "absolute",
      transform: `translate3d(${
        Math.min(store.start.x, store.end.x)
      }px,${
        Math.min(store.start.y, store.end.y)
      }px, 0)`,
      boxSizing: "border-box",
    }
  }

  viewSelection(store: DraggableStore) {
    if (!store.down) {
      return null
    } else {
      return (
        <div style={this.getSelectionStyle(store)}/>
      )
    }
  }

  getContainerStyle(): React.CSSProperties {
    return {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    }
  }

  view() {
    return (
      <Draggable
        onDragStart={this.updateSelection}
        onDragMove={this.updateSelection}
        view={(store, handlers) =>
          <div
            {...handlers}
            style={this.getContainerStyle()}
          >
            {this.viewSelection(store)}
            {this.props.children}
          </div>
        }
      />
    )
  }

}
