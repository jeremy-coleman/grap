import * as React from "react"
import Component from "reactive-magic/component"
import World from "../World"
import Draggable from "./Draggable"
import BlockRecord from "../records/Block"
import { DraggableState } from "../stores/Draggable"

interface PortProps {
	name: string
	block: BlockRecord
}

export default class Port extends Component<PortProps> {
	getId() {
		return this.props.block.id + this.props.name
	}

	getStyle(): React.CSSProperties {
		const hovering = World.PortStore.isHovered(this.getId())
		const hoverColor = World.Theme.subtle.get()
		const normalColor = World.Theme.border.get()
		const size = 12
		return {
			backgroundColor: hovering ? hoverColor : normalColor,
			height: size,
			width: size,
			borderRadius: size,
			color: World.Theme.text.get(),
			outline: "none",
			position: "absolute",
			top: -size / 2,
			left: -size / 2,
			boxSizing: "border-box",
			zIndex: World.zIndex.port,
		}
	}

	handleMouseEnter = e => {
		World.PortStore.hover(this.getId())
	}

	handleMouseLeave = e => {
		World.PortStore.unhover(this.getId())
	}

	handleDragStart = (state: DraggableState) => {
		World.CanvasStore.edge.set({
			block: this.props.block,
			end: this.props.block.get().origin,
		})
	}

	handleDragMove = (state: DraggableState) => {
		const edge = World.CanvasStore.edge.get()
		if (edge) {
			World.CanvasStore.edge.set({
				...edge,
				end: World.CanvasStore.transformPoint(edge.end),
			})
		}
	}

	handleDragEnd = (state: DraggableState) => {
		World.CanvasStore.edge.set(undefined)
		// TODO create the edge!
	}

	view() {
		return (
			<Draggable
				onDragStart={this.handleDragStart}
				onDragMove={this.handleDragMove}
				onDragEnd={this.handleDragEnd}
				view={(state, handlers) => (
					<div
						onMouseEnter={this.handleMouseEnter}
						onMouseLeave={this.handleMouseLeave}
						style={this.getStyle()}
						{...handlers}
					/>
				)}
			/>
		)
	}
}
