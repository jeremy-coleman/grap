import * as React from 'react'
import Component from 'reactive-magic/component'
import Block from "./Block"
import Selection from "./Selection"
import Perspective from "./Perspective"
import World from "./World"
import uuid from "uuid/v4"

interface CanvasProps {}

export default class Canvas extends Component<CanvasProps> {

  view() {
    const blockRecords = World.BlockRegistry.get()
    return (
      <Perspective perspectiveStore={World.PerspectiveStore}>
        <Selection>
          {blockRecords.map(record =>
            <Block record={record} key={record.id}/>
          )}
        </Selection>
      </Perspective>
    )
  }
}
