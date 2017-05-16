import * as React from 'react'
import Component from 'reactive-magic/component'
import World from "./World"
import { Value } from "reactive-magic"

interface Direction {
  x: number
  y: number
}

interface PerspectiveStore {
  x: number
  y: number
  zoom: number
}

interface PerspectiveProps {
  perspectiveStore:  Value<PerspectiveStore>
}

export default class Perspective extends Component<PerspectiveProps> {

  static padding = 50
  static speed = 10
  static delay = 800

  static perspectiveStore(): Value<PerspectiveStore> {
    return new Value({
      x: 0,
      y: 0,
      zoom: 1,
    })
  }

  private store: Value<PerspectiveStore>
  constructor(props: PerspectiveProps) {
    super(props)
    this.store = props.perspectiveStore
  }

  private hovering = false
  startHover() {
    if (!this.hovering) {
      setTimeout(() => {
        this.hovering = false
        this.startMoving()
      }, Perspective.delay)
    }
  }

  private move: Direction = null
  startMoving() {
    requestAnimationFrame(this.animationStep)
  }

  willUnmount() {
    this.move = null
  }

  animationStep = () => {
    if (this.move) {
      this.store.update(({x, y, zoom}) => {
        return {
          x: x - this.move.x * Perspective.speed,
          y: y - this.move.y * Perspective.speed,
          zoom,
        }
      })
      requestAnimationFrame(this.animationStep)
    }
  }

  handleMouseMove = (e: React.MouseEvent<Element>) => {
    const padding = Perspective.padding
    const rect = e.currentTarget.getBoundingClientRect()
    const perspective = this.store.get()
    const x = e.pageX
    const y = e.pageY
    const { top, bottom, left, right, height, width } = rect
    const inside = x >= left && x <= right && y >= top && y <= bottom
    if (!inside) {
      this.move = null
      return
    }
    const moving = !!this.move
    const overlaps = {
      up: Math.max((top - y + padding) / padding, 0),
      down: Math.max((y - bottom + padding) / padding, 0),
      left: Math.max((left - x + padding) / padding, 0),
      right: Math.max((x - right + padding) / padding, 0),
    }
    this.move = {
      x: overlaps.right - overlaps.left,
      y: overlaps.down - overlaps.up,
    }
    if (!moving) {
      this.startHover()
    }
  }

  handleMouseLeave = (e: React.MouseEvent<Element>) => {
    this.move = null
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
      <div
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
        style={this.getContainerStyle()}
      >
        {this.props.children}
      </div>
    )
  }
}
