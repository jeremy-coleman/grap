import * as React from 'react'
import { Value } from 'reactive-magic'
import Component from 'reactive-magic/component'
import Record, { RecordValue } from "./Record"

interface Point {
  x: number
  y: number
}

export interface BlockValue {
  id: string
  down: boolean
  delta: Point
  start?: Point
  end?: Point
}

interface BlockProps {
  store: Record<BlockValue>
}

export default class Block extends Component<BlockProps> {

  componentWillUnmount() {
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

  handleMouseDown = (e: React.MouseEvent<Element>) => {
    const point = {
      x: e.pageX,
      y: e.pageY,
    }
    const store = this.props.store.get()
    this.props.store.set({
      ...store,
      down: true,
      start: point,
      end: point,
    })
    this.startListeners()
  }

  handleMouseMove = (e: MouseEvent) => {
    const store = this.props.store.get()
    if (store.down) {
      const point = {
        x: e.pageX,
        y: e.pageY,
      }
      this.props.store.set({
        ...store,
        end: point,
      })
    }
  }

  handleMouseUp = (e: MouseEvent) => {
    const store = this.props.store.get()
    if (store.down) {
      this.props.store.set({
        ...store,
        down: false,
        start: null,
        end: null,
        delta: this.computeDelta()
      })
      this.stopListeners()
    }
  }

  computeDelta(): Point {
    const { down, delta, start, end } = this.props.store.get()
    if (down) {
      return {
        x: Math.round((delta.x + (end.x - start.x)) / 10) * 10,
        y: Math.round((delta.y + (end.y - start.y)) / 10) * 10,
      }
    } else {
      return delta
    }
  }

  getStyle(): React.CSSProperties {
    const delta = this.computeDelta()
    return {
      width: 50,
      height: 50,
      border: "1px solid black",
      borderRadius: 3,
      backgroundColor: "#333333",
      position: "absolute",
      transform: `translate3d(${delta.x}px,${delta.y}px, 0)`,
      boxSizing: "border-box",
    }
  }

  view() {
    return (
      <div
        style={this.getStyle()}
        onMouseDown={this.handleMouseDown}
      />
    )
  }
}
