import * as React from 'react'
import { Value } from 'reactive-magic'
import Component from 'reactive-magic/component'

interface Point {
  x: number
  y: number
}

interface DraggableHandlers {
  onMouseDown: (e: React.MouseEvent<Element>) => void
}

interface DraggableProps {
  draggableStore?: Value<DraggableStore>
  onDragStart?: (store: DraggableStore) => void
  onDragMove?: (store: DraggableStore) => void
  onDragEnd?: (store: DraggableStore) => void
  view: (store: DraggableStore, handlers: DraggableHandlers) => JSX.Element
}

export interface DraggableStore {
  down: boolean
  start?: Point
  end?: Point
}

export default class Draggable extends Component<DraggableProps> {

  static store(): Value<DraggableStore> {
    return new Value({
      down: false,
      start: null,
      end: null,
    })
  }

  store: Value<DraggableStore>
  constructor(props: DraggableProps) {
    super(props)
    if (props.draggableStore) {
      this.store = props.draggableStore
    } else {
      this.store = Draggable.store()
    }
  }

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

  handleMouseDown = (e: React.MouseEvent<Element>) => {
    const point = {
      x: e.pageX,
      y: e.pageY,
    }
    const store = this.store.get()
    this.store.set({
      down: true,
      start: point,
      end: point,
    })
    this.startListeners()
    e.stopPropagation()
    e.preventDefault()
    if (this.props.onDragStart) {
      this.props.onDragStart(this.store.get())
    }
  }

  handleMouseMove = (e: MouseEvent) => {
    const store = this.store.get()
    if (store.down) {
      const point = {
        x: e.pageX,
        y: e.pageY,
      }
      this.store.assign({
        end: point,
      })
      if (this.props.onDragMove) {
        this.props.onDragMove(this.store.get())
      }
    }
  }

  handleMouseUp = (e: MouseEvent) => {
    const store = this.store.get()
    if (store.down) {
      if (this.props.onDragEnd) {
        this.props.onDragEnd(store)
      }
      this.store.set({
        down: false,
        start: null,
        end: null,
      })
      this.stopListeners()
    }
  }

  view() {
    return this.props.view(
      this.store.get(),
      { onMouseDown: this.handleMouseDown }
    )
  }
}
