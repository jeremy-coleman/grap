import * as React from "react"
import Component from "reactive-magic/component"
import World from "./World"
import { Value } from "reactive-magic"
import Draggable, { DraggableState } from "./Draggable"
import { BlockRecord } from "./Block"
import { Point } from "./utils"

export class PortStore {
  hoveredPorts = new Value({} as { string: boolean })

  isHovered(id: string) {
    const value = this.hoveredPorts.get()
    return value[id]
  }

  hover(id: string) {
    const value = this.hoveredPorts.get()
    value[id] = true
    this.hoveredPorts.set(value)
  }

  unhover(id: string) {
    const value = this.hoveredPorts.get()
    delete value[id]
    this.hoveredPorts.set(value)
  }
}

interface PortProps {
  name: string
  block: BlockRecord
}

export default class Port extends Component<PortProps> {
  getId() {
    return this.props.block.id + this.props.name
  }

  getStyle(): React.CSSProperties {
    const hovering = World.PortStore.isHovered(this.getId())
    const hoverColor = World.Theme.subtle.get()
    const normalColor = World.Theme.border.get()
    const size = 12
    return {
      backgroundColor: hovering ? hoverColor : normalColor,
      height: size,
      width: size,
      borderRadius: size,
      color: World.Theme.text.get(),
      outline: "none",
      position: "absolute",
      top: -size / 2,
      left: -size / 2,
      boxSizing: "border-box",
      zIndex: World.zIndex.port,
    }
  }

  handleMouseEnter = e => {
    World.PortStore.hover(this.getId())
  }

  handleMouseLeave = e => {
    World.PortStore.unhover(this.getId())
  }

  handleDragStart = (state: DraggableState) => {
    World.CanvasStore.edge.set({
      block: this.props.block,
      end: this.props.block.get().origin,
    })
  }

  handleDragMove = (state: DraggableState) => {
    World.CanvasStore.edge.assign({
      end: World.CanvasStore.transformPoint(state.end),
    })
  }

  handleDragEnd = (state: DraggableState) => {
    World.CanvasStore.edge.set(null)
    // TODO create the edge!
  }

  view() {
    return (
      <Draggable
        onDragStart={this.handleDragStart}
        onDragMove={this.handleDragMove}
        onDragEnd={this.handleDragEnd}
        view={(state, handlers) =>
          <div
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            style={this.getStyle()}
            {...handlers}
          />}
      />
    )
  }
}
