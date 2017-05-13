import React from 'react'
import ReactDOM from 'react-dom'
import { css } from 'glamor'

interface Point {
  x: number
  y: number
}

interface BlockState {
  down: boolean
  delta: Point
  start?: Point
  end?: Point
}

export default class Block extends React.PureComponent<{}, BlockState> {

  componentWillUnmount() {
    this.stopListeners()
  }

  startListeners() {
    window.addEventListener("mousemove", this.handleMouseMove)
    window.addEventListener("mouseup", this.handleMouseUp)
  }

  stopListeners() {
    window.removeEventListener("mousemove", this.handleMouseMove)
    window.removeEventListener("mouseup", this.handleMouseUp)
  }

  state = {
    down: false,
    delta: {x: 0, y: 0},
    start: null,
    end: null,
  }

  handleMouseDown = (e: React.MouseEvent<Element>) => {
    const point = {
      x: e.pageX,
      y: e.pageY,
    }
    this.setState({
      down: true,
      start: point,
      end: point,
    })
    this.startListeners()
  }

  handleMouseMove = (e: MouseEvent) => {
    if (this.state.down) {
      const point = {
        x: e.pageX,
        y: e.pageY,
      }
      this.setState({
        end: point,
      })
    }
  }

  handleMouseUp = (e: MouseEvent) => {
    if (this.state.down) {
      this.setState({
        down: false,
        start: null,
        end: null,
        delta: this.computeDelta()
      })
      this.stopListeners()
    }
  }

  computeDelta(): Point {
    const {down, delta, start, end } = this.state
    if (down) {
      return {
        x: Math.round((delta.x + (end.x - start.x)) / 10) * 10,
        y: Math.round((delta.y + (end.y - start.y)) / 10) * 10,
      }
    } else {
      return delta
    }
  }

  getStyle(): React.CSSProperties {
    const delta = this.computeDelta()
    return {
      width: 50,
      height: 50,
      border: "1px solid black",
      borderRadius: 3,
      backgroundColor: "#333333",
      position: "absolute",
      transform: `translate3d(${delta.x}px,${delta.y}px, 0)`,
      boxSizing: "border-box",
    }
  }

  render() {
    return (
      <div
        style={this.getStyle()}
        onMouseDown={this.handleMouseDown}
      />
    )
  }
}
