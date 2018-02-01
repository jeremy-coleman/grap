export default class Storage<Entry> {
	constructor(private name: string = "") {}

	async get(id): Promise<Entry | undefined> {
		const value = localStorage.getItem(this.name + id)
		if (value) {
			return JSON.parse(value)
		}
	}

	async set(id, value: Entry) {
		localStorage.setItem(this.name + id, JSON.stringify(value))
	}

	async remove(id) {
		localStorage.removeItem(this.name + id)
	}

	async getAll(): Promise<Array<Entry>> {
		const values: Array<Entry> = []
		const length = localStorage.length
		for (let i = 0; i < length; i++) {
			values.push(
				JSON.parse(localStorage.getItem(localStorage.key(i) as string) as any)
			)
		}
		return values
	}
}
