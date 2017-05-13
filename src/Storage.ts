export default class Storage<Value> {

  constructor(private name: string) {}

  async get(id): Promise<Value> {
    const value = localStorage.getItem(this.name + id)
    if (value) {
      return JSON.parse(value)
    }
  }

  async set(id, value: Value) {
    localStorage.setItem(this.name + id, JSON.stringify(value))
  }

  async remove(id) {
    localStorage.removeItem(this.name + id)
  }

  async getAll(): Promise<Array<Value>>  {
    const values = []
    const length = localStorage.length
    for (let i = 0; i < length; i++) {
      values.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
    }
    return values
  }

}
