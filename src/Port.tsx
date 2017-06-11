import * as React from "react"
import Component from "reactive-magic/component"
import World from "./World"
import { Value } from "reactive-magic"
import Draggable, { DraggableState } from "./Draggable"

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

interface PortProps extends React.HTMLProps<HTMLDivElement> {
  id: string
}

export default class Port extends Component<PortProps> {
  getStyle(): React.CSSProperties {
    const hovering = World.PortStore.isHovered(this.props.id)
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
      right: -size / 2,
      boxSizing: "border-box",
    }
  }

  handleMouseEnter = e => {
    World.PortStore.hover(this.props.id)
  }

  handleMouseLeave = e => {
    World.PortStore.unhover(this.props.id)
  }

  handleDragStart = (state: DraggableState) => {}
  handleDragMove = (state: DraggableState) => {}
  handleDragEnd = (state: DraggableState) => {}

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
            {...this.props}
            {...handlers}
          />}
      />
    )
  }
}
