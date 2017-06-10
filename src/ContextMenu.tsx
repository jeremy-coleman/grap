import * as React from 'react'
import Component from 'reactive-magic/component'
import { Value } from "reactive-magic"
import { Point } from "./utils"
import World from "./World"
import Button from "./Button"
import * as Actions from "./Actions"

export interface ContextMenuState {
  open: boolean
  where: Point
}

export class ContextMenuStore extends Value<ContextMenuState> {
  constructor() {
    super({open: false, where: null})
  }

  close() {
    if (this.get().open) {
      this.set({open: false, where: null})
    }
  }
}

interface ContextMenuProps {}

export default class ContextMenu extends Component<ContextMenuProps> {

  static height = 200
  static width = 100

  handleWheel = (e) => {
    e.preventDefault()
  }

  handleInsertBlock = (e) => {
    const { where } = World.ContextMenuStore.get()
    Actions.createBlock(World.CanvasStore.transformPoint(where))
    World.ContextMenuStore.close()
  }

  getMenuStyle(where: Point, rect: ClientRect): React.CSSProperties {
    return {
      position: "absolute",
      top: where.y,
      left: where.x,
      // height: ContextMenu.height,
      // width: ContextMenu.width,
      borderRadius: 4,
      backgroundColor: World.Theme.menu.get(),
      borderWidth: 2,
      borderColor: World.Theme.secondary.get(),
      borderStyle: "solid",
    }
  }

  getMenuItemStyle():  React.CSSProperties {
    return {
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 4,
      paddingBottom: 4,
      cursor: "pointer",
    }
  }

  view() {
    const rect = World.CanvasStore.rect.get()
    const { open, where } = World.ContextMenuStore.get()
    if (!open) {
      return null
    }
    return (
        <div
          style={this.getMenuStyle(where, rect)}
          onWheel={this.handleWheel}
        >
          <div
            style={this.getMenuItemStyle()}
            onClick={this.handleInsertBlock}
          >
            Insert Block
          </div>
        </div>
    )
  }
}
