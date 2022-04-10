# Wizzo

A tiny type-safe interface for building websites

## Contributing

I don't expect anyone to contribute but if you want, just open a pull request and/or an issue.

## Get started

Install Wizzo:

```
npm install wizzo
```

Use Wizzo in a project:

```typescript
import E, { state, frag } from "wizzo"

const name = "wizzo"
const count = state(0)
const app = E("div")({ class: "app" })`
  ${E("h1")({ class: "title" })`Hello from ${name}!`}
  Use elements:
  ${E("p")()`A paragraph element (no props on this one)`}
  Add event listeners:
  ${E("button")({
    onClick: e => count.set(oldCount => oldCount + 1),
  })`Click me!`}
  Specify where content should be re-rendered
  ${content => {
    count.subscribe(newCount =>
      content(E("p")({ class: "display" })`Count: ${count}`)
    )
  }}
  Use \`frag\` (like \`React.Fragment\`):
  ${frag`A fragment. you can put children in here too.`}
  ${E("aside")()`Thanks for visiting`}
`

document.body.appendChild(app)
```

## Docs

### `WizzoChild`

The `WizzoChild` type is not exported, but it is used internally for any function taking in children, like Wizzo's default export and `frag` export.

Here is the declaration of it:

```typescript
declare type WizzoElement = HTMLElement | DocumentFragment
declare type WizzoChild =
  | string
  | WizzoElement
  | ((content: (child: HTMLElement) => void) => void)
```

The only surprising part of the declaration should be the function in the union. Wizzo children can be strings, Nodes, or functions, taking in a `content` callback which can be passed an HTMLElement as a child. Whenever the `content` callback is called, it's contents are re-rendered. This is the only way to re-render Wizzo elements (unless you manually change their content using the native DOM api)

### Default export

Wizzo's default export, commonly set to `E` or `$`, creates an element-maker function—it takes in a tag name as input, and returns a function taking in a props object, which returns a function that accepts children (a [tagged template literal][1] which is reduced to an array of `WizzoChild`s), which returns an HTMLElement of the type of the TagName.

A function that returns a function that returns a function. It's hard to explain in words, but easier with code:

```typescript
import E from "wizzo"
const myDiv = E("div")({ class: "my-div" })`
  Some content in this div
`
// myDiv is an HTMLDivElement
```

You can use the default export to create helper elements:

```typescript
import E from "wizzo"
const div = E("div")
const p = E("p")
const strong = E("strong")

const myWidget = div({ class: "widget" })`
  ${p()`Lorem ipsum dolor ${strong()`sit amet`}.}
`
```

Note that void elements (`input`, `br`, etc.) are not automatically closed, so you must give them an empty child tagged template literal:

```typescript
const myInput = E("input")({ type: "text" })``
```

### `frag`

The `frag` export creates a `DocumentFragment` internally, but you can think of it as the Wizzo version of React's `React.Fragment`:

```typescript
import E, { frag } from "wizzo"
const aFragment = frag`
  Woah—this is a fragment.
  ${E("div")()`But you can still put elements in here!`}
`
// aFragment is a DocumentFragment
```

### `state`

Wizzo exports a `state` function that creates a simple setter and subscriber object. It exists to provide simple state without requiring developers to define it themselves.

The generic `state` function takes in an initial value of type `T` and returns an object with properties `set` and `subscribe`:

```typescript
export declare function state<T>(initial: T): {
  set: (value: T | ((oldVal: T) => T)) => void
  subscribe: (val: (val: T) => void) => void
}
```

The state function can be used like so:

```typescript
import E, { state } from "wizzo"
// const counter = state<number>(0)
const counter = state(0)
const app = E("div")({ class: "app" })`
  ${E("button")({
    onClick: e => counter.set(count => count + 1),
  })`Click me please 😀`}
  ${content => {
    counter.subscribe(count => content(E("p")()`Count: ${count}`))
  }}
`
```

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
