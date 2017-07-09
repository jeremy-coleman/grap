import { Value } from "reactive-magic"

export default class PortStore {
	hoveredPorts = new Value({} as { string: boolean })

	isHovered(id: string) {
		const value = this.hoveredPorts.get()
		return value[id]
	}

	hover(id: string) {
		const value = this.hoveredPorts.get()
		value[id] = true
		this.hoveredPorts.set(value)
	}

	unhover(id: string) {
		const value = this.hoveredPorts.get()
		delete value[id]
		this.hoveredPorts.set(value)
	}
}
