import * as React from 'react'
import Component from 'reactive-magic/component'
import Block, { BlockRecord } from "./Block"
import World from "./World"
import uuid from "uuid/v4"

interface AppProps {}

export default class App extends Component<AppProps> {

  createBlock = () => {
    BlockRecord.create({
      id: uuid(),
      down: false,
      delta: {x: 0, y: 0},
      start: null,
      end: null,
    })
  }

  view() {
    const blockRecords = World.BlockRegistry.get()
    return (
      <div>
        <button onClick={this.createBlock}>new block</button>
        {blockRecords.map(record =>
          <Block record={record} key={record.id}/>
        )}
      </div>
    )
  }
}
