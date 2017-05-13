import React from 'react'
import ReactDOM from 'react-dom'
import { css } from 'glamor'
import Block from "./Block"

const style = css({
  color: 'blue'
})

class Index extends React.PureComponent<{},{}> {
  render() {
    return (
      <div className={`${style}`}>
        <Block/>
        <Block/>
      </div>
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<Index/>, root)
