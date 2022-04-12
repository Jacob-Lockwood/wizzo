export function state<T>(initial: T) {
  let internal = initial
  const subscribers: ((val: T) => void)[] = []
  const subscribe = (val: (val: T) => void) => (
    subscribers.push(val), val(internal)
  )
  type setterCallback<T> = (oldVal: T) => T
  const isSetterCb = (val: unknown): val is setterCallback<T> =>
    typeof val === "function"
  const set = (value: T | setterCallback<T>) => {
    internal = isSetterCb(value) ? value(internal) : value
    subscribers.forEach(sub => sub(internal))
  }
  return { set, subscribe }
}
