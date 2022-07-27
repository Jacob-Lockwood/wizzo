Note: I will probably not be maintaining this very actively as I have realised that there is a more complete alternative to Wizzo that is better maintained and has pretty much the same goals: [SolidJS](https://github.com/solidjs/solid)

# Wizzo

A _tiny_ (768 B) type-safe interface for building websites

## What is Wizzo

Basically, it's a wrapper around the DOM API that makes updating content reactively easy without any expensive VDOM or similar calculations. It's about as fast as the DOM can get (or at least close to it). It's lightweight, written in TypeScript, and supports ESM and CommonJS.

## Contributing

I don't expect anyone to contribute but if you want, just open a pull request and/or an issue.

## Get started

Install Wizzo:

### via NPM (using a bundler):

```
npm install wizzo
# or
yarn add wizzo
```

### With a CDN:

```html
<script type="module">
  import E from "https://unpkg.com/wizzo"
</script>
```

Use Wizzo in a project:

```typescript
import { state, frag, e } from "wizzo"
const name = "wizzo"
const [count, setCount] = state<number>(0)
const app = e.div({ class: "app" })`
  ${e.h1({ class: "title" })`Hello from ${name}!`}
  Use elements:
  ${e.p()`A paragraph element (no props on this one)`}
  Add event listeners:
  ${e.button({
    onClick: e => setCount(count => count + 1),
  })`Click me!`}
  Use an built-in re-rendering state function
  ${e.p({ class: "display" })`Count: ${count}`}
  Or explicitly define what and when to re-render:
  ${e.div()`${async content => {
    content`Loading...`
    const response = await fetch("...")
    const json = await response.json()
    content`JSON data: ${JSON.stringify(json, 2, null)}`
  }}`} 
  Use ${e.code()`frag`} (like ${e.code()`React.Fragment`}):
  ${frag`A fragment. you can put children in here too.`}
  ${e.aside()`Thanks for visiting`}
`
// No fancy render function! `app` is just an HTMLDivElement.
document.body.appendChild(app)
```

## Docs

### `WizzoChild`

The `WizzoChild` type exported, but it is mainly used internally for any function taking in children, like Wizzo's default export and `frag` export.

Here is the declaration of it:

```typescript
declare type WizzoElement = HTMLElement | DocumentFragment
declare type WizzoChild =
  | string
  | WizzoElement
  | ((content: (...templateString: WizzoTaggedTemplate) => void) => void)
```

The only surprising part of the declaration should be the function in the union. Wizzo children can be strings, Nodes, or functions, taking in a `content` callback which can be passed a [tagged template literal][1] as children. Whenever the `content` callback is called, it's contents are re-rendered. This is the only way to re-render Wizzo elements (unless you manually change their content using the native DOM api)

### Default export

Wizzo's default export, commonly set to `E` or `$`, creates an element-maker function—it takes in a tag name as input, and returns a function taking in a props object, which returns a function that accepts children (a tagged template literal] which is reduced to an array of `WizzoChild`ren), which returns an HTMLElement of the type of the TagName.

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

But, you can also take these elements from the `e` export.

Note that void elements (`input`, `br`, etc.) are not automatically closed, so you must give them an empty child tagged template literal:

```typescript
const myInput = E("input")({ type: "text" })``
```

### `e`

The `e` export is internally a proxy that maps any property access to a call to the default export, but it is effectively an object containing all element functions.

```typescript
import { e } from "wizzo"
const myWidget = e.div({ class: "widget" })`
  ${e.p()`Lorem ipsum dolor ${e.strong()`sit amet`}.}
`
```

### `frag`

The `frag` export creates a `DocumentFragment` internally, but you can think of it as the Wizzo version of React's `React.Fragment`:

```typescript
import { e, frag } from "wizzo"
const aFragment = frag`
  Woah—this is a fragment.
  ${e.div()`But you can still put elements in here!`}
`
// aFragment is a DocumentFragment
```

### `state`

Wizzo exports a `state` function that creates a simple setter and subscriber object. It exists to provide simple state without requiring developers to define it themselves.

The generic `state` function takes in an initial value of type `T` and returns an object with properties `set` and `subscribe`:

```typescript
declare function state<T>(
  initial: T
): [WizzoChild, (value: T | setterCallback<T>) => void]
```

The state function can be used like so:

```typescript
import { e, state } from "wizzo"
const [count, setCount] = state<number>(0)
const app = e.div({ class: "app" })`
  ${e.button({
    onClick: e => setCount(count => count + 1),
  })`Click me please 😀`}
  ${e.p()`Count: ${count}`}
`
```

Note that the first element of the array returned is not a value to be used but rather a Wizzo element that can be directly rendered to the page.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
