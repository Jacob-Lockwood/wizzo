import E, { e, frag, state } from "../src"

function color(color: string, text: string): string {
  const consoleColor = {
    red: "\x1b[31m",
    blue: "\x1b[34m",
    green: "\x1b[32m",
  }[color]
  return `${consoleColor}${text}\x1b[0m`
}

function test(
  name: string,
  callback: (it: (name: string, callback: () => boolean) => void) => void
): void {
  const tests: { [test: string]: boolean | Error } = {}

  callback((name, callback) => {
    try {
      tests[name] = callback()
    } catch (error) {
      tests[name] = error instanceof Error ? error : new Error(String(error))
    }
  })
  console.info(
    color(
      "blue",
      `💡 ${name}: ${
        Object.values(tests).filter(val => val && !(val instanceof Error))
          .length
      } of ${Object.values(tests).length} tests passed`
    )
  )
  for (const [name, result] of Object.entries(tests)) {
    if (result && !(result instanceof Error))
      console.log(color("green", `  ✅ Test passed: it ${name}`))
    else console.error(color("red", `  ❌ Test failed: it ${name} - ${result}`))
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
const todo: typeof test = () => {}

test("E function", it => {
  it("returns a function", () => typeof E("blockquote") === "function")
  it("returns a function that returns a function", () =>
    typeof E("blockquote")({ class: "class" }) === "function")

  const element = E("blockquote")({
    class: "class",
    title: "title",
  })`Lorem ipsum dolor sit amet`
  it("sets attributes on element", () =>
    element.classList.contains("class") &&
    element.getAttribute("title") === "title")
  it("sets text content", () =>
    element.textContent === "Lorem ipsum dolor sit amet")

  /** @type {HTMLDivElement} */
  const elementWithInlineStyle: HTMLDivElement = E("div")({
    style: { marginTop: "5rem" },
  })`test`
  console.log(elementWithInlineStyle.outerHTML)
  it("defines inline style", () =>
    elementWithInlineStyle.style.marginTop === "5rem")

  const elementWithChildren = E("div")()`
    Test test test
    ${E("p")()`paragraph`}
  `
  it("appends child elements", () =>
    elementWithChildren.firstElementChild?.textContent === "paragraph")
})

test("e object proxy", it => {
  it("maps property access onto E function", () => {
    const element = e.blockquote({ class: "class" })`Lorem ipsum dolor sit amet`
    return element.textContent === "Lorem ipsum dolor sit amet"
  })
})

test("frag function", it => {
  it("creates a DocumentFragment", () => {
    const fragment = frag`document fragment`
    return fragment.nodeName === "#document-fragment"
  })
})

todo("state function", it => {
  const [count, setCount] = state(0)
})
