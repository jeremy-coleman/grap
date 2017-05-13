import World from "./World"
import { Value } from 'reactive-magic'
import Storage from "./Storage"

export interface RecordValue {
  id: string
}

export default class Record<Kind extends RecordValue> {

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
    this.storage.set(value.id, value)
  }

}
