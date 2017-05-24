import * as React from 'react'
import Component from 'reactive-magic/component'
import { BlockRecord } from "./Block"
import Button from "./Button"
import World from "./World"
import uuid from "uuid/v4"

interface ToolboxProps {}

export default class Toolbox extends Component<ToolboxProps> {

  createBlock = () => {
    const record = BlockRecord.create({
      id: uuid(),
      height: 50,
      width: 50,
      origin: {x: 0, y: 0},
    })
    World.CanvasStore.selectedBlocks.set([record])
  }

  getStyle(): React.CSSProperties {
    return {
      display: "flex",
      flexDirection: "column",
      padding: 8,
      justifyContent: "center",
    }
  }

  view() {
    return (
      <div style={this.getStyle()}>
        <Button onClick={this.createBlock}>new block</Button>
      </div>
    )
  }
}
