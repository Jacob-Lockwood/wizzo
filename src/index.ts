import type { Props, Style } from "./wizzoPropTypes"
import type { EvtListener } from "./eventMap"

type WizzoElement = HTMLElement | DocumentFragment
export type WizzoChild =
  | string
  | WizzoElement
  | ((content: (...templateString: WizzoTaggedTemplate) => void) => void)

type WizzoTaggedTemplate = [
  strings: TemplateStringsArray,
  ...values: Array<WizzoChild | WizzoChild[]>
]

const wizzoTaggedTemplateToWizzoChildrenArr = ([
  strings,
  ...values
]: WizzoTaggedTemplate) =>
  values
    .flat()
    .reduce<WizzoChild[]>(
      (array, value, index) => [...array, value, strings[index + 1]],
      [strings[0]]
    )
    .filter(Boolean)

export const frag = (...templateString: WizzoTaggedTemplate) => {
  const fragment = new DocumentFragment()
  fragment.append(...templateToChildren(templateString))
  return fragment
}

const templateToChildren = (templateString: WizzoTaggedTemplate) =>
  wizzoTaggedTemplateToWizzoChildrenArr(templateString).map(child => {
    if (typeof child !== "function") return child
    const fragment = frag``
    child((...templateString) =>
      fragment.replaceChildren(...templateToChildren(templateString))
    )
    return fragment
  })

const isListener = <T1 extends Event, T2 extends HTMLElement>(
  key: string,
  value: unknown
): value is EvtListener<T1, T2> => key.slice(0, 2) === "on"
const isStyle = (key: string, value: unknown): value is Style => key === "style"

export default function E<T extends keyof HTMLElementTagNameMap>(tagName: T) {
  return (props?: Props<T>) =>
    (...templateString: WizzoTaggedTemplate) => {
      const ele = document.createElement(tagName)
      ele.append(...templateToChildren(templateString))
      if (props)
        for (const [key, value] of Object.entries(props)) {
          if (isStyle(key, value))
            for (const [prop, val] of Object.entries(value)) {
              ele.style.setProperty(prop, val || null)
            }
          else if (isListener(key, value))
            ele.addEventListener(
              key.slice(2).toLowerCase(),
              value as EventListener
            )
          else if (typeof value === "string") ele.setAttribute(key, value)
        }
      return ele
    }
}

export type { EvtListener, Props, Style }

export { state } from "./state"

type ElementMap = {
  [tagName in keyof HTMLElementTagNameMap]: (
    props: Props<tagName>
  ) => (
    ...templateString: WizzoTaggedTemplate
  ) => HTMLElementTagNameMap[tagName]
}
/** An object containing easy access to all HTML Elements */
const e = new Proxy<ElementMap>({} as ElementMap, {
  get: (_, prop: keyof HTMLElementTagNameMap) => E(prop),
})
export { e }
