import * as React from 'react'
import Component from 'reactive-magic/component'
import World from "./World"

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> { }

export default class Button extends Component<ButtonProps> {

  getStyle(): React.CSSProperties {
    return {
      backgroundColor: World.Theme.secondary2.get(),
      border: `2px solid ${World.Theme.secondary.get()}`,
      borderRadius: 3,
      padding: "4px 8px",
      color: World.Theme.text.get(),
      outline: "none",
    }
  }

  view() {
    return (
      <button style={this.getStyle()} {...this.props}/>
    )
  }
}
