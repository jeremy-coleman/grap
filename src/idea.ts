/*

- clean up and refactor and slim down old stuff
- create the validator npm package from notion
- build the abstration for Nodes
- create an abstraction for writing to the database
- build the interface
- build electron app and create git, npm, filesystem abstraction

*/

// import * as validate from "typescript-validator"

// import {ObjectOptional} from "typelevel-ts"
import * as Magic from "reactive-magic"
import Component from "reactive-magic/component"
import { Required } from "typelevel-ts"

// Keep it simple. No need to even tie yourself to react as a rendering library...

// Edges are directional. Some ports accept inputs and some send outputs.
// For simplicity and generality, the edge can be initialized from either direction.
export type Port<In, Out> = {
	in: In
	out: Out
}

// A mapping of all ports.
export type PortMap = {
	[key: string]: Port<any, any>
}

export type PortMapInputs<T extends PortMap> = {
	[key in keyof T]: T[key]["in"]
}

export type PortMapOutputs<T extends PortMap> = {
	[key in keyof T]: T[key]["out"]
}

export type ComponentProps<P extends PortMap> = {
	ports: PortMapInputs<P>
}

// The type definition for a node in the graph.
export type Node<P extends PortMap> = {
	// When you start creating a port, we use this function to determine
	// what other ports you can connect to. Inputs are always optional.
	validate(ports: Partial<PortMapInputs<P>>): boolean
	// It shouldn't matter what order the ports are initialized in, but we can
	// encrouage the best order.
	init(): PortMapOutputs<P>
	// A React component that's expected to render and interact with the ports.
	component: React.Component<{ ports: PortMapInputs<P> }, any>
}

type CounterPorts = {
	// This value is gettable from this component, but settable by another component.
	delta?: Port<Magic.Gettable<number>, Magic.Settable<number>>
	// This value is settable from this component, but gettgable by another component.
	value: Port<Magic.Settable<number>, Magic.Gettable<number>>
}

export type CounterProps = ComponentProps<CounterPorts>

export class Counter extends Component<CounterProps> {
	private delta: Magic.Gettable<number>
	private value: Magic.Settable<number>

	constructor(props: CounterProps) {
		super(props)
		// TODO:Why isnt this type checked?!
		this.delta = props.ports.delta
		if (props.ports.delta) {
		} else {
			this.delta = new Magic.Value(1)
		}
		if (props.ports.value) {
			this.value = props.ports.value
		} else {
			this.value = new Magic.Value(0)
		}
	}

	willUpdate() {
		// Wire up any changes to the reactive vlues
	}
	view() {
		return null
	}
}

// What is the underlying data structure of the graph?

export interface Graph {
	nodes: { [key: string]: Node<any> }
	edges: { [key: string]: Array<string> }
}

// The actual node can be aliased to a a git repo when its persisted
// and save along with the state of the UI (todo).

type x = { x?: { x: number } }
type y = { [k in keyof x]: x[k]["x"] }

function f(x: { [key: string]: number }) {}
const x: { a?: number; b: number } = { b: 1 }
f(x)

type X<T extends { [key: string]: number }> = T["a"]
type z = X<{ a?: number; b: number }>
