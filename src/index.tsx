import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { css } from 'glamor'
import BlockRecord from "./BlockRecord"
import App from "./App"

const style = css({
  color: 'blue'
})

async function main() {
  const records = await BlockRecord.load()
  if (records.length === 0) {
    records.push(
      new BlockRecord({
        id: "1",
        down: false,
        delta: {x: 0, y: 0},
        start: null,
        end: null,
      })
    )
    records.push(
      new BlockRecord({
        id: "2",
        down: false,
        delta: {x: 100, y: 0},
        start: null,
        end: null,
      })
    )
  }

  const root = document.createElement('div')
  document.body.appendChild(root)

  ReactDOM.render(<App blockRecords={records}/>, root)

}

main()
