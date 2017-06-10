import * as React from 'react'
import { Value, DerivedValue } from 'reactive-magic'
import Component from 'reactive-magic/component'
import uuid from "uuid/v4"
import keycode from "keycode"
import Block, { BlockRecord } from "./Block"
import World from "./World"
import Draggable, { DraggableStore, DraggableState } from "./Draggable"
import { Point } from "./utils"
import ContextMenu from "./ContextMenu"
import * as Actions from "./Actions"

interface Perspective {
  x: number
  y: number
  zoom: number
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

  rect: Value<ClientRect> = new Value({
    width: 1,
    height: 1,
    top: 0,
    left: 0,
    right: 1,
    bottom: 1,
  })

  centerOfView(): Point {
    const {top, height, width, left} = this.rect.get()
    return this.transformPoint({
      y: top + height / 2,
      x: left + width / 2,
    })
  }

  // Transform a point on the screen (from Draggable) to a point within a
  // rect, accounting for the perspective.
  transformPoint(point: Point): Point {
    // normalize x and y from [-0.5,0.5] with 0 at the center
    const {top, left, width, height} = this.rect.get()
    const centered = {
      x: (point.x - left) / width - 0.5,
      y: (point.y - top) / height - 0.5,
    }
    // zoom in at the center of the screen
    const {x, y, zoom} = this.perspective.get()
    const stretched = {
      x: centered.x / zoom,
      y: centered.y / zoom,
    }
    // map [-0.5,0.5] to [0,width] and [0,height]
    const cropped = {
      x: (stretched.x + 0.5) * width - x,
      y: (stretched.y + 0.5) * height - y,
    }
    return cropped
  }

  viewport: DerivedValue<ClientRect> = new DerivedValue(() => {
    const { top, left, bottom, right, width, height } = this.rect.get()
    const topLeft = this.transformPoint({x: left, y: top})
    const bottomRight = this.transformPoint({x: right, y: bottom})
    return {
      top: topLeft.y,
      left: topLeft.x,
      bottom: bottomRight.y,
      right: bottomRight.x,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    }
  })
}

interface CanvasProps {}

export default class Canvas extends Component<CanvasProps> {

  willMount() {
    window.addEventListener("keydown", this.handleKeyDown)
  }

  didMount() {
    World.CanvasStore.rect.set(this.root.getBoundingClientRect())
    window.addEventListener("resize", this.onResize)
  }

  willUnmount() {
    window.removeEventListener("resize", this.onResize)
    window.removeEventListener("keydown", this.handleKeyDown)
  }

  onResize = e => {
    World.CanvasStore.rect.set(this.root.getBoundingClientRect())
  }

  updateSelection = (store: DraggableState) => {
    World.ContextMenuStore.close()
    const rect = World.CanvasStore.rect.get()
    const start = World.CanvasStore.transformPoint(store.start)
    const end = World.CanvasStore.transformPoint(store.end)
    if (store.down) {
      const blocks = World.BlockRegistry.get()
      const left = Math.min(start.x, end.x)
      const right = Math.max(start.x, end.x)
      const top = Math.min(start.y, end.y)
      const bottom = Math.max(start.y, end.y)
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

  getSelectionBoxStyle(store: DraggableState): React.CSSProperties {
    const rect = World.CanvasStore.rect.get()
    const start = World.CanvasStore.transformPoint(store.start)
    const end = World.CanvasStore.transformPoint(store.end)
    const flipY = end.x < start.x
    const flipX = end.y < start.y
    const rotateX = flipX ? "180deg" : "0"
    const rotateY = flipY ? "180deg" : "0"
    return {
      width: Math.abs(start.x - end.x),
      height: Math.abs(start.y - end.y),
      border: "1px solid blue",
      borderRadius: 3,
      backgroundColor: World.Theme.primary.get(),
      opacity: 0.1,
      position: "absolute",
      transformOrigin: "top left",
      transform: `translate3d(${start.x}px,${start.y}px,0) rotateX(${rotateX}) rotateY(${rotateY})`,
      boxSizing: "border-box",
    }
  }

  viewSelectionBox(store: DraggableState) {
    if (!store.down) {
      return null
    } else {
      return (
        <div style={this.getSelectionBoxStyle(store)}/>
      )
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === keycode("backspace")) {
      Actions.deleteSelection()
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
    const { x, y, zoom } = World.CanvasStore.perspective.get()
    const { width, height} = World.CanvasStore.rect.get()
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

  getCanvasStyle(): React.CSSProperties {
    return {
      position: "absolute",
      height: "100%",
      width: "100%",
    }
  }

  handleWheel = (e) => {
    e.preventDefault()
    World.ContextMenuStore.close()
    const speed = 0.1
    const {x, y, zoom} = World.CanvasStore.perspective.get()
    if (e.ctrlKey) {
      const { left, top, width, height} = World.CanvasStore.rect.get()
      // Offset x and y to zoom in on the mouse location
      const mouse = {
        x: (e.clientX - left - width / 2) / zoom,
        y: (e.clientY - top - height / 2) / zoom,
      }
      World.CanvasStore.perspective.set({
        x: x - (speed * e.deltaX / zoom) + mouse.x * e.deltaY / 100,
        y: y - (speed * e.deltaY / zoom) + mouse.y * e.deltaY / 100,
        zoom: zoom * Math.exp(-e.deltaY / 100),
      })
    } else {
      World.CanvasStore.perspective.set({
        zoom,
        x: x - (speed * e.deltaX / zoom),
        y: y - (speed * e.deltaY / zoom),
      })
    }
  }

  handleContextMenu = (e) => {
    e.preventDefault()
    World.ContextMenuStore.set({
      open: true,
      where: {
        x: e.clientX,
        y: e.clientY,
      }
    })
  }

  viewGridLines() {
    const viewport = World.CanvasStore.viewport.get()
    const { zoom } = World.CanvasStore.perspective.get()

    // Between 5 and 20 lines at any zoom
    const step = Math.pow(10, Math.round(Math.log10(viewport.width) - 1.0))

    const vLines = Math.round(viewport.right / step) - Math.round(viewport.left / step) + 1

    const vDivs = Array(vLines).fill(0).map((_, index) => {
      const n = (Math.round(viewport.left / step) + index)
      return (
        <div
          key={"v" + n}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: viewport.height,
            borderWidth: 1 / zoom,
            borderStyle: "solid",
            borderColor: "white",
            opacity: 0.2,
            transform: `translate3d(${n * step}px,${viewport.top}px,0)`
          }}
        />
      )
    })

    const hLines = Math.round(viewport.bottom / step) - Math.round(viewport.top / step) + 1

    const hDivs = Array(hLines).fill(0).map((_, index) => {
      const n = (Math.round(viewport.top / step) + index)
      return (
        <div
          key={"h" + n}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: viewport.width,
            borderWidth: 1 / zoom,
            borderStyle: "solid",
            borderColor: "white",
            opacity: 0.2,
            transform: `translate3d(${viewport.left}px,${n * step}px,0)`
          }}
        />
      )
    })

    return [...vDivs, hDivs]
  }

  viewCanvasOrigin() {
    const viewport = World.CanvasStore.viewport.get()
    const { zoom } = World.CanvasStore.perspective.get()
    const width = 1 / zoom
    const edge = Math.min(viewport.height, viewport.width) / 2
    return (
      <div>
        <div
          style={{
            position: "absolute",
            top: `calc(50% - ${Math.max(1, width)}px)`,
            left: `calc(50% - ${edge / 2}px)`,
            width: edge,
            borderWidth: width,
            borderStyle: "solid",
            borderColor: "white",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: `calc(50% - ${edge / 2}px)`,
            left: `calc(50% - ${Math.max(1, width)}px)`,
            height: edge,
            borderWidth: width,
            borderStyle: "solid",
            borderColor: "white",
            opacity: 0.2,
          }}
        />
      </div>
    )
  }

  viewCenterFocus() {
    const {x, y, zoom} = World.CanvasStore.perspective.get()
    const { width, height} = World.CanvasStore.rect.get()
    const edge = Math.max(1, 8 / zoom)
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate3d(${width / 2 - x - edge / 2}px, ${height / 2 - y - edge / 2}px, 0px)`,
          borderRadius: edge,
          height: edge,
          width: edge,
          backgroundColor: "red",
        }}
      />
    )
  }

  renderStats() {
    const { x, y, zoom } = World.CanvasStore.perspective.get()
    return (
      <div style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: 8,
        color: "white",
        opacity: 0.2,
        fontFamily: "monospace",
        textAlign: "right",
      }}>
        x: {x.toFixed(0)}<br/>
        y: {y.toFixed(0)}<br/>
        zoom: {zoom.toFixed(2)}
      </div>
    )
  }

  view() {
    const blockRecords = World.BlockRegistry.get()
    return (
      <div>
        {this.renderStats()}
        <Draggable
          onDragStart={this.updateSelection}
          onDragMove={this.updateSelection}
          onDragEnd={this.updateSelection}
          view={(store, handlers) =>
            <div
              className="canvas"
              {...handlers}
              ref={this.ref}
              style={this.getContainerStyle()}
              onWheel={this.handleWheel}
              onContextMenu={this.handleContextMenu}
            >
              <div
                className="perspective"
                style={this.getPerspectiveStyle()}
              >
                {this.viewSelectionBox(store)}
                {blockRecords.map(record =>
                  <Block record={record} key={record.id}/>
                )}
              </div>
            </div>
          }
        />
        <ContextMenu/>
      </div>
    )
  }

}
