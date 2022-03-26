import { EvtListener, Props, Style } from "./wizzoPropTypes"

type WizzoElement = HTMLElement | DocumentFragment
type WizzoChild =
  | string
  | WizzoElement
  | ((content: (child: HTMLElement) => void) => void)
type WizzoTaggedTemplate = [
  strings: TemplateStringsArray,
  ...values: Array<WizzoChild | WizzoChild[]>
]

const WizzoTaggedTemplateToWizzoChildrenArr = ([
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

const templateToChildren = (templateString: WizzoTaggedTemplate) =>
  WizzoTaggedTemplateToWizzoChildrenArr(templateString).map(child => {
    if (typeof child !== "function") return child
    let temp: HTMLElement = $("div")()``
    child(newChild => {
      temp.replaceWith(newChild)
      temp = newChild
    })
    return temp
  })

const isListener = <
  T1 extends keyof HTMLElementEventMap,
  T2 extends keyof HTMLElementTagNameMap
>(
  key: string,
  value: any
): value is EvtListener<T1, T2> => key.slice(0, 2) === "on"
const isStyle = (key: string, value: any): value is Style => key === "style"

export default function $<T extends keyof HTMLElementTagNameMap>(tagName: T) {
  return (props?: Props<T>) =>
    (...templateString: WizzoTaggedTemplate) => {
      const ele = document.createElement(tagName)
      ele.append(...templateToChildren(templateString))
      if (props)
        for (const [key, value] of Object.entries(props)) {
          if (isStyle(key, value))
            for (const [prop, val] of Object.entries(value)) {
              ele.style.setProperty(prop, val as string)
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

export const frag = (...templateString: WizzoTaggedTemplate) => {
  const fragment = new DocumentFragment()
  fragment.append(...templateToChildren(templateString))
  return fragment
}
