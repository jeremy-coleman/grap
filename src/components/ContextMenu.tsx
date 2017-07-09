import * as React from "react"
import Component from "reactive-magic/component"
import World from "../World"
import menuActions from "../actions/menuActions"
import keycode from "keycode"
import { Point } from "../utils/types"

interface ContextMenuProps {}

export default class ContextMenu extends Component<ContextMenuProps> {
	static height = 200
	static width = 100

	willMount() {
		window.addEventListener("keydown", this.handleKeyDown)
	}

	willUnmount() {
		window.removeEventListener("keydown", this.handleKeyDown)
	}

	handleKeyDown = e => {
		if (e.keyCode === keycode("escape")) {
			World.ContextMenuStore.close()
		}
	}

	handleWheel = e => {
		e.preventDefault()
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

	getMenuItemStyle(): React.CSSProperties {
		return {
			paddingLeft: 8,
			paddingRight: 8,
			paddingTop: 4,
			paddingBottom: 4,
			cursor: "pointer",
			fontFamily: "monospace",
			color: World.Theme.text.get(),
		}
	}

	handleAction(action) {
		return e => {
			action()
			World.ContextMenuStore.close()
		}
	}

	view() {
		const rect = World.CanvasStore.rect.get()
		const { open, where } = World.ContextMenuStore.get()
		if (!open) {
			return null
		}
		return (
			<div style={this.getMenuStyle(where, rect)} onWheel={this.handleWheel}>
				{menuActions
					.filter(action => action.valid())
					.map(({ name, action }) => {
						return (
							<div
								style={this.getMenuItemStyle()}
								onClick={this.handleAction(action)}
							>
								{name}
							</div>
						)
					})}
			</div>
		)
	}
}
