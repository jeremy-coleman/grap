import * as React from "react"
import Component from "reactive-magic/component"
import World from "./World"
import { Point } from "./utils"

export enum PortDirection {
  up,
  down,
  left,
  right,
}

interface EdgePathProps {
  start: Point
  end: Point
  startDir?: PortDirection
  endDir?: PortDirection
}

export class EdgePath extends Component<EdgePathProps> {
  getPathStyle(): React.CSSProperties {
    return {
      stroke: "red",
      strokeWidth: 2,
      fill: "transparent",
    }
  }

  getRigidity(delta: number): number {
    if (Math.abs(delta) > 100) {
      return 100 + Math.pow(Math.abs(delta) - 100, 0.75)
    } else {
      return Math.abs(delta)
    }
  }

  view() {
    const { start, end } = this.props
    const delta = {
      x: end.x - start.x,
      y: end.y - start.y,
    }

    const padding = 50

    const pathStart = {
      x: delta.x > 0 ? padding : -delta.x + padding,
      y: delta.y > 0 ? padding : -delta.y + padding,
    }

    const pathEnd = {
      x: delta.x > 0 ? delta.x + padding : padding,
      y: delta.y > 0 ? delta.y + padding : padding,
    }

    let bezier = ""
    // move to the start
    bezier += `M${pathStart.x} ${pathStart.y} `
    // place a control point for the start
    if (this.props.startDir === PortDirection.right) {
      const rigidity = this.getRigidity(delta.x)
      bezier += `C ${pathStart.x + rigidity} ${pathStart.y}, `
    } else if (this.props.startDir === PortDirection.left) {
      const rigidity = this.getRigidity(delta.x)
      bezier += `C ${pathStart.x - rigidity} ${pathStart.y}, `
    } else if (this.props.startDir === PortDirection.up) {
      const rigidity = this.getRigidity(delta.y)
      bezier += `C ${pathStart.x} ${pathStart.y - rigidity}, `
    } else if (this.props.startDir === PortDirection.down) {
      const rigidity = this.getRigidity(delta.y)
      bezier += `C ${pathStart.x} ${pathStart.y + rigidity}, `
    } else {
      bezier += `C ${pathStart.x} ${pathStart.y}, `
    }
    // place a control for the end
    // place a control point for the start
    if (this.props.endDir === PortDirection.right) {
      const rigidity = this.getRigidity(delta.x)
      bezier += `${pathEnd.x - rigidity} ${pathEnd.y}, `
    } else if (this.props.endDir === PortDirection.left) {
      const rigidity = this.getRigidity(delta.x)
      bezier += `${pathEnd.x + rigidity} ${pathEnd.y}, `
    } else if (this.props.endDir === PortDirection.up) {
      const rigidity = this.getRigidity(delta.y)
      bezier += `${pathEnd.x} ${pathEnd.y - rigidity}, `
    } else if (this.props.endDir === PortDirection.down) {
      const rigidity = this.getRigidity(delta.y)
      bezier += `${pathEnd.x} ${pathEnd.y + rigidity}, `
    } else {
      bezier += `${pathEnd.x} ${pathEnd.y}, `
    }
    // end the path at the bottom right
    bezier += `${pathEnd.x} ${pathEnd.y}`

    return (
      <svg
        width={Math.abs(delta.x) + 2 * padding}
        height={Math.abs(delta.y) + 2 * padding}
        style={{
          position: "absolute",
          top: start.y - padding,
          left: start.x - padding,
          transformOrigin: `${padding}px ${padding}px`,
          transform: `translate3d(${delta.x > 0 ? 0 : delta.x}px, ${delta.y > 0
            ? 0
            : delta.y}px, 0)`,
        }}
      >
        <path style={this.getPathStyle()} d={bezier} />
      </svg>
    )
  }
}
