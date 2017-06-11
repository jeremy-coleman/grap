import World from "./World"
import { Value } from "reactive-magic"
import Storage from "./Storage"
import Registry from "./Registry"

export interface RecordValue {
  id: string
}

export default class Record<Kind extends RecordValue> {
  public id: string
  private value: Value<Kind>
  private storage: Storage<Kind>
  private registry: Registry<Kind>
  constructor(value: Kind, storage: Storage<Kind>, registry: Registry<Kind>) {
    this.id = value.id
    this.value = new Value(value)
    this.storage = storage
    this.registry = registry
    this.registry.add(this)
  }

  save() {
    const value = this.value.get()
    this.storage.set(value.id, value)
  }

  get() {
    return this.value.get()
  }

  set(value: Kind) {
    this.value.set(value)
    this.storage.set(value.id, value)
  }

  assign(value: Partial<Kind>) {
    this.value.assign(value)
    const newValue = this.value.get()
    this.storage.set(newValue.id, newValue)
  }

  delete() {
    this.registry.remove(this)
    this.storage.remove(this.value.get().id)
  }
}
