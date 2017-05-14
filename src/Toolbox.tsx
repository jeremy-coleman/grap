import * as React from 'react'
import Component from 'reactive-magic/component'
import { BlockRecord } from "./Block"
import uuid from "uuid/v4"

interface ToolboxProps {}

export default class Toolbox extends Component<ToolboxProps> {

  createBlock = () => {
    BlockRecord.create({
      id: uuid(),
      down: false,
      height: 50,
      width: 50,
      delta: {x: 0, y: 0},
      start: null,
      end: null,
    })
  }

  getStyle(): React.CSSProperties {
    return {

    }
  }

  view() {
    return (
      <div style={this.getStyle()}>
        <button onClick={this.createBlock}>new block</button>
      </div>
    )
  }
}
