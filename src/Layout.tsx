import * as React from 'react'
import Component from 'reactive-magic/component'
import Block from "./Block"
import Selection from "./Selection"
import World from "./World"
import uuid from "uuid/v4"

interface LayoutProps {
  canvas: JSX.Element
  toolbox: JSX.Element
}

export default class Layout extends Component<LayoutProps> {

  getContainerStyle(): React.CSSProperties {
    return {
      position: "fixed",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      display: "flex",
    }
  }

  getCanvasStyle(): React.CSSProperties {
    return {
      flex: 1,
      position: "relative",
    }
  }

  getToolboxStyle(): React.CSSProperties {
    return {
      width: 200,
      position: "relative",
      backgroundColor: "#666666",
    }
  }

  view(props: LayoutProps) {
    return (
      <div style={this.getContainerStyle()}>
        <div style={this.getCanvasStyle()}>{props.canvas}</div>
        <div style={this.getToolboxStyle()}>{props.toolbox}</div>
      </div>
    )
  }
}
