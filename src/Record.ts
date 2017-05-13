import World from "./World"
import { Value } from 'reactive-magic'
import Storage from "./Storage"
import uuid from 'uuid/v4'

export interface RecordValue {
  id: string
}

export default class Record<Kind extends RecordValue> {

  static create<Kind extends RecordValue>(value: Kind, storage: Storage<Kind>) {
    const record = new Record(value, storage)
    Record.save(value, storage)
    return record
  }

  static save<Kind extends RecordValue>(value: Kind, storage: Storage<Kind>) {
    storage.set(value.id, value)
  }

  public id: string
  private value: Value<Kind>
  private storage: Storage<Kind>
  constructor(value: Kind, storage: Storage<Kind>) {
    this.id = value.id
    this.value = new Value(value)
    this.storage = storage
  }

  get() {
    return this.value.get()
  }

  set(value: Kind) {
    this.value.set(value)
    Record.save(value, this.storage)
  }

}
