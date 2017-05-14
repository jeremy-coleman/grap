import * as React from "react"
import World from "./World"
import { Value } from 'reactive-magic'
import Component from 'reactive-magic/component'
import { BlockRecord } from "./Block"

export class SelectionStore {

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
}

interface Point {
  x: number
  y: number
}

interface MouseStore {
    down: boolean
    start?: Point
    end?: Point
}

export default class Selection extends Component<{}> {

  willUnmount() {
    this.stopListeners()
  }

  startListeners() {
    window.addEventListener("mousemove", this.handleMouseMove)
    window.addEventListener("mouseup", this.handleMouseUp)
  }

  stopListeners() {
    window.removeEventListener("mousemove", this.handleMouseMove)
    window.removeEventListener("mouseup", this.handleMouseUp)
  }

  private mouse: Value<MouseStore> = new Value({
    down: false,
    start: null,
    end: null,
  })

  handleMouseDown = (e: React.MouseEvent<Element>) => {
    const point = {
      x: e.pageX,
      y: e.pageY,
    }
    this.mouse.set({
      down: true,
      start: point,
      end: point,
    })
    this.startListeners()
    e.stopPropagation()
    e.preventDefault()
  }

  handleMouseMove = (e: MouseEvent) => {
    const mouse = this.mouse.get()
    if (mouse.down) {
      const point = {
        x: e.pageX,
        y: e.pageY,
      }
      this.mouse.set({
        ...mouse,
        end: point
      })
    }
  }

  handleMouseUp = (e: MouseEvent) => {
    const mouse = this.mouse.get()
    if (mouse.down) {
      this.mouse.set({
        down: false,
        start: null,
        end: null,
      })
      this.stopListeners()
    }
  }

  getSelectionStyle(): React.CSSProperties {
    const mouse = this.mouse.get()
    return {
      width: Math.abs(mouse.start.x - mouse.end.x),
      height: Math.abs(mouse.start.y - mouse.end.y),
      border: "1px solid blue",
      borderRadius: 3,
      backgroundColor: "#0000BB",
      opacity: 0.2,
      position: "absolute",
      transform: `translate3d(${
        Math.min(mouse.start.x, mouse.end.x)
      }px,${
        Math.min(mouse.start.y, mouse.end.y)
      }px, 0)`,
      boxSizing: "border-box",
    }
  }

  viewSelection() {
    const mouse = this.mouse.get()
    if (!mouse.down) {
      return null
    } else {
      return (
        <div style={this.getSelectionStyle()}/>
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
      <div style={this.getContainerStyle()} onMouseDown={this.handleMouseDown}>
        {this.viewSelection()}
        {this.props.children}
      </div>
    )
  }

}
