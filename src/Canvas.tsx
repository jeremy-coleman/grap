import * as React from 'react'
import { Value } from 'reactive-magic'
import Component from 'reactive-magic/component'
import uuid from "uuid/v4"
import keycode from "keycode"
import Block, { BlockRecord } from "./Block"
import Perspective from "./Perspective"
import World from "./World"
import Draggable, { DraggableStore, DraggableState } from "./Draggable"

export class CanvasStore {

  draggableStore = new DraggableStore()

  selectedBlocks: Value<Array<BlockRecord>> = new Value([])

  blockIsSelected(record: BlockRecord) {
    return this.selectedBlocks.get().some(r => r.id === record.id)
  }

  selectionIsEmpty() {
    return this.selectedBlocks.get().length === 0
  }

}

interface CanvasProps {}

export default class Canvas extends Component<CanvasProps> {

  accountForOrigin(store: DraggableState): DraggableState {
    const rect = this.root.getBoundingClientRect()
    return {
      ...store,
      start: {
        x: store.start.x - rect.left,
        y: store.start.y - rect.top,
      },
      end: {
        x: store.end.x - rect.left,
        y: store.end.y - rect.top,
      }
    }

  }

  updateSelection = (store: DraggableState) => {
    store = this.accountForOrigin(store)
    if (store.down) {
      const blocks = World.BlockRegistry.get()
      const left = Math.min(store.start.x, store.end.x)
      const right = Math.max(store.start.x, store.end.x)
      const top = Math.min(store.start.y, store.end.y)
      const bottom = Math.max(store.start.y, store.end.y)
      const selected = blocks.filter(block => {
        const { height, width, origin: { x, y } } = block.get()
        const xAround = left < x && right > x
        const xInside = left >= x && left <= x + width
        const yAround = top < y && bottom > y
        const yInside = top >= y && top <= y + height
        return (xAround || xInside) && (yAround || yInside)
      })
      World.CanvasStore.selectedBlocks.set(selected)
    }
  }

  getSelectionStyle(store: DraggableState): React.CSSProperties {
    store = this.accountForOrigin(store)
    return {
      width: Math.abs(store.start.x - store.end.x),
      height: Math.abs(store.start.y - store.end.y),
      border: "1px solid blue",
      borderRadius: 3,
      backgroundColor: World.Theme.primary.get(),
      opacity: 0.1,
      position: "absolute",
      transform: `translate3d(${
        Math.min(store.start.x, store.end.x)
      }px,${
        Math.min(store.start.y, store.end.y)
      }px, 0)`,
      boxSizing: "border-box",
    }
  }

  viewSelection(store: DraggableState) {
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

  willMount() {
    window.addEventListener("keydown", this.handleKeyDown)
  }

  willUnount() {
    window.removeEventListener("keydown", this.handleKeyDown)
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === keycode("backspace")) {
      World.CanvasStore.selectedBlocks.get().forEach(block => {
        block.delete()
      })
    }
  }

  private root: Element
  ref = (node) => {
    this.root = node
  }

  view() {
    const blockRecords = World.BlockRegistry.get()
    return (
      <Draggable
        onDragStart={this.updateSelection}
        onDragMove={this.updateSelection}
        view={(store, handlers) =>
          <div
            {...handlers}
            ref={this.ref}
            style={this.getContainerStyle()}
          >
            {this.viewSelection(store)}
            {blockRecords.map(record =>
              <Block record={record} key={record.id}/>
            )}
          </div>
        }
      />
    )
  }

}
