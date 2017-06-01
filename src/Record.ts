import World from "./World"
import { Value } from 'reactive-magic'
import Storage from "./Storage"
import Registry from "./Registry"

export interface RecordValue {
  id: string
}

export default class Record<Kind extends RecordValue> {

  static create<Kind extends RecordValue>(
    value: Kind, storage: Storage<Kind>,
    registry: Registry<Kind>
  ) {
    const record = new Record(value, storage, registry)
    Record.save(value, storage)
    return record
  }

  static save<Kind extends RecordValue>(value: Kind, storage: Storage<Kind>) {
    storage.set(value.id, value)
  }

  static delete<Kind extends RecordValue>(value: Kind, storage: Storage<Kind>) {
    storage.remove(value.id)
  }

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

  get() {
    return this.value.get()
  }

  set(value: Kind) {
    this.value.set(value)
    Record.save(value, this.storage)
  }

  assign(value: Partial<Kind>) {
    this.value.assign(value)
    Record.save(this.value.get(), this.storage)
  }

  delete() {
    this.registry.remove(this)
    Record.delete(this.value.get(), this.storage)
  }

}
