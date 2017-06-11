import * as React from "react"
import Component from "reactive-magic/component"
import World from "./World"

interface EdgeProps extends React.SVGProps<SVGPathElement> {}

export default class Edge extends Component<EdgeProps> {
  getPathStyle(): React.CSSProperties {
    return {
      stroke: "red",
      strokeWidth: 2,
      fill: "transparent",
    }
  }

  view() {
    const start = { x: 50, y: 50 }
    const end = { x: 250, y: 150 }
    const delta = {
      x: end.x - start.x,
      y: end.y - start.y,
    }

    const padding = 10
    const rigidity = 50

    let bezier = ""
    // move to the start
    bezier += `M${padding} ${padding} `
    // place a control point to the right of the start
    bezier += `C ${padding + rigidity} ${padding}, `
    // place a control point to the left of the end
    bezier += `${delta.x + padding - rigidity} ${delta.y + padding}, `
    // end the path at the bottom right
    bezier += `${delta.x + padding} ${delta.y + padding}`

    return (
      <svg
        width={delta.x + 2 * padding}
        height={delta.y + 2 * padding}
        style={{
          position: "absolute",
          top: start.y - padding,
          left: start.x - padding,
        }}
      >
        <path style={this.getPathStyle()} d={bezier} />
      </svg>
    )
  }
}
