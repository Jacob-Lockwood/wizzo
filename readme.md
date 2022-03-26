# Wizzo

A tiny type-safe interface for building websites

## Get started

Install Wizzo:

```
npm install wizzo
```

Use Wizzo in a project:

```lang-ts
// index.ts
import E, { state } from "wizzo"

const name: string = "wizzo"
const count = state(0)
const app: HTMLDivElement = E("div")({ class: "app" })`
  ${E("h1")({ class: "title" })`Hello from ${name}!`}
  ${E("p")()`A paragraph element (no props on this one)`}
  And some text just inside the div.
  ${E("button")({ onClick: e => count.set(oldCount => oldCount + 1) })`Click me!`}
  ${content => {
    count.subscribe(newCount => content(
      E("p")({ class: "display" })`Count: ${count}`
    ))
  }}
  $("aside")()`Thanks for visiting`
`

document.body.appendChild(app)
```

## Docs

### Default export

Wizzo's default export, commonly set to `E` or `$`, creates an element-maker function—it takes in a tag name as input, and returns a function taking in a props object, which returns a function that accepts children.

```lang-ts
import E from "wizzo"
const div = E("div")
const aDivElement = div({ class: "hi" })`content / children go here`
// aDivElement is HTMLDivElement
```
