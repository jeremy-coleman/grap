// Lets simplify this even more and start building the UI. This is going in circles...
// Clean up the existing code. Make it typesafe. Cleanup the Record abstraction. Create
// a registry for Ports and start connecting them. Create some blocks and get them to work.
// It will be more obvious after that...

// This is a port at runtime.
type Port<Value, Data> = {
	// The value of a port can be anything. It should probably contain listeners
	// and functions to negotiate handshaking with other ports.
	value: Value
	// Ports can persist data as well to preserve its state between reloads.
	save(): Data
	load(data: Data): Port<Value, Data>
	// Every port needs to implement these functions for the UI to hook into.
	canConnect(port: Port<any, any>): boolean
	handleConnect(port: Port<any, any>): void
	handleDisconnect(port: Port<any, any>): void
}

// This is the port data saved in the database.
type PortData<Data> = {
	id: string
	data: Data
}

type GenericPorts = { [key: string]: Port<any, any> }

type BlockData<Ports extends GenericPorts, Data> = {
	id: string
	data: Data
	ports: { [key in keyof Ports]: string }
}

// This is a block
type Block<Ports extends { [key: string]: Port<any, any> }> = {
	init(): Ports
	component: React.Component<{ ports: Ports }, any>
}

type Scale = Array<number>

type ScalePort = Port<{
	type: "scale"
	readonly scale: Scale
	set(scale: Scale): void
	addListener(fn: (scale: Scale) => void): void
	removeListener(fn: (scale: Scale) => void): void
}>

type EdgeData = {
	start: string
	end: string
}

// type BlockData<Ports extends { [key: string]: Port<any> }> = {
// 	ports: {[key in keyof Ports]: string}
// }

const ScaleBlock = {
	init() {
		return {}
	},
}
