import * as React from "react"
import Component from "reactive-magic/component"
import World from "../World"
import Draggable from "./Draggable"
import { DraggableState } from "../stores/Draggable"
import { Point } from "../utils/types"
import BlockRecord from "../records/Block"
import Port from "./Port"

const snapSize = 1

interface BlockProps {
	record: BlockRecord
}

export default class Block extends Component<BlockProps> {
	// Compute the origin of the block. If the block is selected, account
	// for dragging it as well.
	static computeOrigin(record: BlockRecord, store: DraggableState): Point {
		const selected = World.CanvasStore.blockIsSelected(record)
		const { origin } = record.get()
		if (selected && store.down) {
			const start = World.CanvasStore.transformPoint(store.start)
			const end = World.CanvasStore.transformPoint(store.end)
			return {
				x: Math.round((origin.x + (end.x - start.x)) / snapSize) * snapSize,
				y: Math.round((origin.y + (end.y - start.y)) / snapSize) * snapSize,
			}
		} else {
			return origin
		}
	}

	// If the block is not selected when we start dragging it, then it
	// should be the only selected block.
	handleDragStart = (store: DraggableState) => {
		World.ContextMenuStore.close()
		if (!World.CanvasStore.blockIsSelected(this.props.record)) {
			World.CanvasStore.selectedBlocks.set([this.props.record])
		}
	}

	// If a drag ends without moving, its essentially a click
	didntMove(store: DraggableState) {
		if (store.down) {
			return store.start.x === store.end.x && store.start.y === store.end.y
		} else {
			return false
		}
	}

	// If we clicked a block, then select it, otherwise, update the positions
	// of all selected blocks.
	handleDragEnd = (store: DraggableState) => {
		if (this.didntMove(store)) {
			World.CanvasStore.selectedBlocks.set([this.props.record])
		} else {
			World.CanvasStore.selectedBlocks.get().forEach(record => {
				const state = record.get()
				record.set({
					...state,
					origin: Block.computeOrigin(record, store),
				})
			})
		}
	}

	getStyle(store: DraggableState): React.CSSProperties {
		const origin = Block.computeOrigin(this.props.record, store)
		const { height, width } = this.props.record.get()
		const selected = World.CanvasStore.blockIsSelected(this.props.record)
		const primary = World.Theme.primary.get()
		const border = World.Theme.border.get()
		return {
			width,
			height,
			border: `2px solid ${selected ? primary : border}`,
			borderRadius: 3,
			backgroundColor: World.Theme.block.get(),
			position: "absolute",
			transform: `translate3d(${origin.x}px,${origin.y}px, 0)`,
			boxSizing: "border-box",
			zIndex: World.zIndex.block,
		}
	}

	view() {
		return (
			<Draggable
				draggableStore={World.CanvasStore.draggableStore}
				onDragStart={this.handleDragStart}
				onDragEnd={this.handleDragEnd}
				view={(store, handlers) => (
					<div style={this.getStyle(store)} {...handlers}>
						<Port block={this.props.record} name="port" />
					</div>
				)}
			/>
		)
	}
}
