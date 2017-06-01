import * as React from 'react'
import { Value } from 'reactive-magic'
import Component from 'reactive-magic/component'
import uuid from "uuid/v4"
import keycode from "keycode"
import Block, { BlockRecord } from "./Block"
import World from "./World"
import Draggable, { DraggableStore, DraggableState } from "./Draggable"

// TODO
// - view grid
// - view origin
// - view zoom and offset stats

interface Perspective {
  x: number
  y: number
  zoom: number
}

interface Point {
  x: number
  y: number
}

export class CanvasStore {

  draggableStore = new DraggableStore()

  selectedBlocks: Value<Array<BlockRecord>> = new Value([])

  blockIsSelected(record: BlockRecord) {
    return this.selectedBlocks.get().some(r => r.id === record.id)
  }

  selectionIsEmpty() {
    return this.selectedBlocks.get().length === 0
  }

  perspective: Value<Perspective> = new Value({
    x: 0,
    y: 0,
    zoom: 1,
  })

}

interface CanvasProps {}

export default class Canvas extends Component<CanvasProps> {

  rect: Value<ClientRect> = new Value({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })

  didMount() {
    this.rect.set(this.root.getBoundingClientRect())
    window.addEventListener("resize", this.onResize)
  }

  willUnmount() {
    window.removeEventListener("resize", this.onResize)
  }

  onResize = e => {
    this.rect.set(this.root.getBoundingClientRect())
  }

  transformPoint(point: Point) {
    // normalize x and y from [-0.5,0.5] with 0 at the center
    const {top, left, width, height} = this.rect.get()
    const centered = {
      x: (point.x - left) / width - 0.5,
      y: (point.y - top) / height - 0.5,
    }
    // zoom in at the center of the screen
    const {x, y, zoom} = World.CanvasStore.perspective.get()
    const stretched = {
      x: centered.x / zoom,
      y: centered.y / zoom,
    }
    // map [-0.5,0.5] to [0,width] and [0,height]
    const cropped = {
      x: (stretched.x + 0.5) * width,
      y: (stretched.y + 0.5) * height,
    }
    return cropped
  }

  accountForPerspective(store: DraggableState): DraggableState {
    return {
      ...store,
      start: this.transformPoint(store.start),
      end: this.transformPoint(store.end),
    }
  }

  updateSelection = (store: DraggableState) => {
    store = this.accountForPerspective(store)
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
    store = this.accountForPerspective(store)
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
    if (!store.down || !this.rect.get()) {
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
      overflow: "hidden",
    }
  }

  getPerspectiveStyle(): React.CSSProperties {
    const {x, y, zoom} = World.CanvasStore.perspective.get()
    const { width, height} = this.rect.get()
    return {
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      // we always want to be zooming into the center of the viewport
      transformOrigin: `${width / 2 - x}px ${height / 2 - y}px`,
      transform: `translate3d(${x}px, ${y}px, 0px) scale(${zoom})`,
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
    if (e.keyCode === keycode("=")) {
      World.CanvasStore.perspective.update(state => ({
        ...state,
        zoom: state.zoom * 1.1
      }))
    }
    if (e.keyCode === keycode("-")) {
      World.CanvasStore.perspective.update(state => ({
        ...state,
        zoom: state.zoom / 1.1
      }))
    }
    const step = 10
    if (e.keyCode === keycode("left")) {
      World.CanvasStore.perspective.update(state => ({
        ...state,
        x: state.x + (step / state.zoom)
      }))
    }
    if (e.keyCode === keycode("right")) {
      World.CanvasStore.perspective.update(state => ({
        ...state,
        x: state.x - (step / state.zoom)
      }))
    }
    if (e.keyCode === keycode("up")) {
      World.CanvasStore.perspective.update(state => ({
        ...state,
        y: state.y + (step / state.zoom)
      }))
    }
    if (e.keyCode === keycode("down")) {
      World.CanvasStore.perspective.update(state => ({
        ...state,
        y: state.y - (step / state.zoom)
      }))
    }
  }

  private root: Element
  ref = (node) => {
    this.root = node
  }


  getXAxisStyle(): React.CSSProperties {
    return {
      position: "absolute",
      top: "calc(50% - 1px)",
      left: 0,
      right: 0,
      border: "2px solid white",
    }
  }

  getYAxisStyle(): React.CSSProperties {
    return {
      position: "absolute",
      top: 0,
      left: "calc(50% - 1px)",
      bottom: 0,
      border: "2px solid white",
    }
  }

  getOriginStyle(): React.CSSProperties {
    const {x, y, zoom} = World.CanvasStore.perspective.get()
    const { width, height} = this.rect.get()
    return {
      position: "absolute",
      top: 0,
      left: 0,
      transform: `translate3d(${width / 2 - x}px, ${height / 2 - y}px, 0px)`,
      height: 2,
      width: 2,
      backgroundColor: "red",
    }
  }

  getCanvasStyle(): React.CSSProperties {
    return {
      position: "absolute",
      height: "100%",
      width: "100%",
    }
  }

  onWheel = (e) => {
    e.preventDefault()
    const speed = 0.1
    World.CanvasStore.perspective.update(state => ({
      ...state,
      x: state.x - (speed * e.deltaX / state.zoom),
      y: state.y - (speed * e.deltaY / state.zoom),
      zoom: e.ctrlKey ? state.zoom * Math.exp(-e.deltaY / 100) : state.zoom,
    }))
  }

  viewGrid() {
    return (
      <div>
        <div style={this.getXAxisStyle()}/>
        <div style={this.getYAxisStyle()}/>
        <div style={this.getOriginStyle()}/>
      </div>
    )
  }

  view() {
    const blockRecords = World.BlockRegistry.get()
    return (
      <Draggable
        onDragStart={this.updateSelection}
        onDragMove={this.updateSelection}
        view={(store, handlers) =>
          <div
            className="canvas"
            {...handlers}
            ref={this.ref}
            style={this.getContainerStyle()}
            onWheel={this.onWheel}
          >
            <div
              className="perspective"
              style={this.getPerspectiveStyle()}
            >
              {this.viewSelection(store)}
              {this.viewGrid()}
              {blockRecords.map(record =>
                <Block record={record} key={record.id}/>
              )}
            </div>
          </div>
        }
      />
    )
  }

}
