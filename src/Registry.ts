import { Value } from 'reactive-magic'
import Record, { RecordValue } from "./Record"

export default class Registry<Kind extends RecordValue> {
  private records: Value<Array<Record<Kind>>>
  constructor(records: Array<Record<Kind>>) {
    this.records = new Value(records)
  }

  get() {
    return this.records.get()
  }

  set(records: Array<Record<Kind>>) {
    this.records.set(records)
  }

  add(record: Record<Kind>) {
    this.records.update(records => {
      records.push(record)
      return records
    })
  }

  remove(record: Record<Kind>) {
    this.records.update(records => {
      return records.filter(r => r.id !== record.id)
    })
  }
}
