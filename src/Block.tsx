import * as React from 'react'
import { Value } from 'reactive-magic'
import Component from 'reactive-magic/component'
import Record, { RecordValue } from "./Record"
import World from "./World"

interface Point {
  x: number
  y: number
}

interface BlockProps {
  record: BlockRecord
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
    const record = this.props.record.get()
    this.props.record.set({
      ...record,
      down: true,
      start: point,
      end: point,
    })
    this.startListeners()
  }

  handleMouseMove = (e: MouseEvent) => {
    const record = this.props.record.get()
    if (record.down) {
      const point = {
        x: e.pageX,
        y: e.pageY,
      }
      this.props.record.set({
        ...record,
        end: point,
      })
    }
  }

  handleMouseUp = (e: MouseEvent) => {
    const record = this.props.record.get()
    if (record.down) {
      this.props.record.set({
        ...record,
        down: false,
        start: null,
        end: null,
        delta: this.computeDelta()
      })
      this.stopListeners()
    }
  }

  computeDelta(): Point {
    const { down, delta, start, end } = this.props.record.get()
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

export interface BlockValue {
  id: string
  down: boolean
  delta: Point
  start?: Point
  end?: Point
}

export class BlockRecord extends Record<BlockValue> {

  static create(value: BlockValue) {
    const record = new BlockRecord(value)
    Record.save(value, World.BlockStorage)
    return record
  }

  constructor(value: BlockValue) {
    super(value, World.BlockStorage)
  }

  static async load(): Promise<Array<BlockRecord>> {
    const blocks = await World.BlockStorage.getAll()
    const records = blocks.map(block => new BlockRecord(block))
    return records
  }

}
