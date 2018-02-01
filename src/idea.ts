/*

- create the validator npm package from notion

--- HERE

https://www.typescriptlang.org/play/index.html#src=%2F%2F%20I%20have%20directional%20relationships%20in%20a%20graph%20that%20I'm%20representing%0D%0A%2F%2F%20with%20this%20type%20that%20has%20a%20complementary%20relationship%20regarding%20the%0D%0A%2F%2F%20direction.%0D%0Atype%20Relationship%3CLeft%2C%20Right%3E%20%3D%20%7B%0D%0A%20%20%20%20left%3A%20Left%0D%0A%20%20%20%20right%3A%20Right%0D%0A%7D%0D%0A%0D%0A%2F%2F%20Get%20from%20the%20left%2C%20set%20from%20the%20right.%0D%0Atype%20Gettable%3CV%3E%20%3D%20Relationship%3C()%20%3D%3E%20V%2C%20(v%3A%20V)%20%3D%3E%20void%3E%0D%0A%0D%0A%2F%2F%20Get%20from%20the%20right%2C%20set%20from%20the%20left.%0D%0Atype%20Settable%3CV%3E%20%3D%20Relationship%3C(v%3A%20V)%20%3D%3E%20void%2C%20()%20%3D%3E%20V%3E%0D%0A%0D%0A%2F%2F%20Suppose%20we%20have%20a%20schema%20that%20defines%20the%20relationships%20for%20some%0D%0A%2F%2F%20node%20in%20the%20graph.%20Here's%20a%20generic%20node%2C%20that%20has%20one%20relationship%0D%0A%2F%2F%20that%20allows%20other%20nodes%20to%20get%20its%20value.%20Notice%20that%20its%20optional%0D%0A%2F%2F%20--%20the%20relationship%20does%20not%20have%20to%20exist.%0D%0Atype%20ValueNode%3CT%3E%20%3D%20%7Bvalue%3F%3A%20Gettable%3CT%3E%7D%0D%0A%0D%0A%2F%2F%20Now%20suppose%20we%20want%20to%20initialize%20this%20node.%20Internally%20this%20node%0D%0A%2F%2F%20behaves%20as%20the%20right%20side%20of%20the%20relationship%20and%20external%20node%0D%0A%2F%2F%20interact%20with%20the%20left%20side%20of%20this%20relationship.%20Thus%2C%20it%20would%20%0D%0A%2F%2F%20be%20convenient%20to%20create%20a%20generic%20type%20that%20gives%20us%20the%20left%20and%0D%0A%2F%2F%20right%20mapping%20of%20these%20types.%0D%0Atype%20RelationshipMap%20%3D%20%7B%0D%0A%20%20%20%20%5Bkey%3A%20string%5D%3A%20Relationship%3Cany%2C%20any%3E%0D%0A%7D%0D%0A%0D%0Atype%20LeftRelationships%3CT%20extends%20RelationshipMap%3E%20%3D%20%7B%0D%0A%20%20%20%20%5Bkey%20in%20keyof%20T%5D%3A%20T%5Bkey%5D%5B%22left%22%5D%0D%0A%7D%0D%0A%0D%0Atype%20RightRelationships%3CT%20extends%20RelationshipMap%3E%20%3D%20%7B%0D%0A%20%20%20%20%5Bkey%20in%20keyof%20T%5D%3A%20T%5Bkey%5D%5B%22right%22%5D%0D%0A%7D%0D%0A%0D%0A%2F%2F%20And%20here'%20we%20get%20stuck.%20%0D%0A%2F%2F%20%0D%0A%2F%2F%20I'm%20not%20able%20to%20get%20the%20optional%20relationship%20to%20pass%20through%20%0D%0A%2F%2F%20homeomorphically.%0D%0A%2F%2F%20%0D%0A%2F%2F%20When%20you%20turn%20strictNullChecks%20off%2C%20the%20relationship%20works.%20But%0D%0A%2F%2F%20with%20strictNullChecks%20on%2C%20you%20get%20an%20error!%0D%0Atype%20ValueNodeRight%3CT%3E%20%3D%20RightRelationships%3CValueNode%3CT%3E%3E%0D%0A%0D%0A%2F%2F%20So%20let's%20try%20encoding%20the%20nullability%20in%20this%20type.%0D%0Atype%20RelationshipMap2%20%3D%20%7B%0D%0A%20%20%20%20%5Bkey%3A%20string%5D%3A%20Relationship%3Cany%2C%20any%3E%20%7C%20undefined%0D%0A%7D%0D%0A%0D%0A%2F%2F%20But%20now%20we%20have%20an%20isue%20getting%20the%20%22right%22%20property%20off%0D%0A%2F%2F%20of%20undefined.%0D%0Atype%20RightRelationships2%3CT%20extends%20RelationshipMap2%3E%20%3D%20%7B%0D%0A%20%20%20%20%5Bkey%20in%20keyof%20T%5D%3A%20T%5Bkey%5D%5B%22right%22%5D%0D%0A%7D%0D%0Atype%20ValueNodeRight2%3CT%3E%20%3D%20RightRelationships2%3CValueNode%3CT%3E%3E%0D%0A%0D%0A%2F%2F%20Here's%20another%20shot.%20Lets%20try%20tp%20map%20to%20the%20NonNullable%20value.%0D%0A%2F%2F%20https%3A%2F%2Fgithub.com%2Fgcanti%2Ftypelevel-ts%2Fblob%2Fmaster%2Fsrc%2Findex.ts%23L183%0D%0Atype%20RightRelationships3%3CT%20extends%20RelationshipMap2%3E%20%3D%20%7B%0D%0A%20%20%20%20%5Bkey%20in%20keyof%20T%5D%3A%20(T%5Bkey%5D%20%26%20%7B%7D)%5B%22right%22%5D%0D%0A%7D%0D%0Atype%20ValueNodeRight3%3CT%3E%20%3D%20RightRelationships2%3CValueNode%3CT%3E%3E

- build the abstration for Nodes
	- need an abstraction for linking reactive variables to each other.
- clean up and refactor and slim down old stuff
- create an abstraction for writing to the database
- build the interface
- build electron app and create git, npm, filesystem abstraction

---
Discussion
- the state of the application is defined by the ports.
	- the ui state of each node can be local to the component.
- how does instantiation work? how do edges work?
	- all values and relationships should be lazy so we dont have to compute the dependency
		graph when evaluating.
	- Gettable
		- ports that you call .get() on to get their value (lazily).
		- you can addListener() to be notified when their value is stale, but don't .get() it until
			you need it because other values may change on the same tick.
		- you can removeListener() to clean up when an edge gets removed.
		- using reactive magic you'll never have to worry about listeners
	- Settable extends Gettable
		- ports that you call .set() on to set their value and emit to their listeners.

	- Examples
		- A counter block with a delta. In input delta is gettable. The input value is settable.
			When delta does not exist, we can use an internal value that an be changed by the UI.
			When the delta port is connected, we simply use that value to .get() from.

		- What happens when we connect two values the same. Imagine we have 3 "scale blocks" and we
			want them all to be in sync. The UI an define them and they are all controlled by the same
			underlying scale. You can imagine connecting all three edges together to define that they
			are all synced up. There's no need to encode control flow in the UI. Think about excel.

			Do ports need the in/out concept? Can we simply clone and connect values?
			Can we build a UI that delegates these concepts to the plugin?

			Number blocks and counter blocks, the way pure data works, encodes events and stuff like that.
			How could our UI plugin abstraction accomodate this sort of use case?

			What if I just want to create a network and having things react to their position in it?

			We need a generalization for the simplest part of this... who's connected to who, can they
			connect, and potentially some sort of initialization handshake when connections are created
			and removed. We can render ports however we want in the UI. Its not necessary to have them
			pre-baked.

			Lets think about the UI components first...

			<Edge id={string} start={Port.id} end={Port.id}/>
			<Port id={string}/>

			// There's some global registry of ports and each port has an input
			// schema and an output schema. This schema doesnt have to be complex.
			// It can simply be a label that need to identify what its expecting.
			const ports = {
				1: {input: "get(number)", output: "set(number)"}
			}
			In order for two ports to be able to be connected, the input and output
			of those ports must match. That is, port 1 accepts a input of "get(number)"
			which means it wants to be able to get a number from some other block. Another
			block which generates values has an input of "set(number)" and an output of
			"get(number)" which means that it accepts a value that it can set values on
			and means that it should connect to other ports that...


			Even this is too complicated. A port can be literally anything. The handshake is up
			to plugins themselves. We just want to organize the handshake...

			type Port<V,O> = {
				value: V
				canConnect(port: Port<O>): boolean
				handleConnect(port: Port<O>) {}
				handleDisconnect(port: Port<O>) {}
			}

			Then the Node needs some fascilities to handle handshaking with other nodes through
			their ports.

			type Node<Ports extends {[key: string]: Port<any,any>}> = {
				ports: Ports
			}


	- concrete use cases:
		- Number block
			- creates a Value, as Gettable and Settable
		- Counter block
			- created a

*/

// import * as validate from "typescript-validator"

// import {ObjectOptional} from "typelevel-ts"
import * as Magic from "reactive-magic"
import Component from "reactive-magic/component"
import { Required, NonNullable } from "typelevel-ts"

// Keep it simple. No need to even tie yourself to react as a rendering library...

// Edges are directional. Some ports accept inputs and some send outputs.
// For simplicity and generality, the edge can be initialized from either direction.
export type Port<In, Out> = {
	in: In
	out: Out
}

// A mapping of all ports.
export type PortMap = {
	[key: string]: Port<any, any> | undefined
}

export type PortMapInputs<T extends PortMap> = {
	[key in keyof T]: NonNullable<T[key]>["in"]
}

export type PortMapOutputs<T extends PortMap> = {
	[key in keyof T]: NonNullable<T[key]>["out"]
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

function pipe<T>(from: Magic.Gettable<T>, to: Magic.Gettable<T>) {
	// from.
}

// How do I pipe a gettable into a settable?
// How do I pipe a settable into a gettable?

export class Counter extends Component<CounterProps> {
	private delta: Magic.Gettable<number> = new Magic.Value(0)
	private value: Magic.Settable<number> = new Magic.Value(1)

	constructor(props: CounterProps) {
		super(props)
		// TODO: Why isnt this type checked?!
		if (props.ports.delta) {
			// props.ports.delta
			this.delta = props.ports.delta
		} else {
			this.delta = new Magic.Value(1)
		}
		if (props.ports.value) {
			this.value = props.ports.value
		} else {
			this.value = new Magic.Value(0)
		}
	}

	willUpdate(nextProps: CounterProps) {
		// Wire up any changes to the reactive values
		if (nextProps.ports.delta !== this.props.ports.delta) {
			this.delta = this.props.ports.delta
		} else {
			this.delta = new Magic.Value(1)
		}
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
