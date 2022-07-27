import type { WizzoChild } from "./index"

type setterCallback<T> = (oldVal: T) => T
export function state<T>(
  initial: T
): [WizzoChild, (value: T | setterCallback<T>) => void] {
  let internal = initial
  let subscriber: (val: T) => void
  const getter: WizzoChild = content => {
    subscriber = val => content`${String(val)}`
  }
  const isSetterCb = (val: unknown): val is setterCallback<T> =>
    typeof val === "function"
  const setter = (value: T | setterCallback<T>) => {
    internal = isSetterCb(value) ? value(internal) : value
    subscriber(internal)
  }
  return [getter, setter]
}
