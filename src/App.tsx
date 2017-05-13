import * as React from 'react'
import Component from 'reactive-magic/component'
import Block from "./Block"
import BlockRecord from "./BlockRecord"

interface AppProps {
  blockRecords: Array<BlockRecord>
}

export default class App extends Component<AppProps> {
  view() {
    return (
      <div>
        {this.props.blockRecords.map(record =>
          <Block store={record} key={record.id}/>
        )}
      </div>
    )
  }
}
