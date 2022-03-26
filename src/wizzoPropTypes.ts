import { EnumHtmlAttributes } from "html-element-attributes-typescript"

type SpecialPropTagNames = keyof typeof EnumHtmlAttributes
type HtmlElementTagNameAttributesMap = {
  [TagName in keyof HTMLElementTagNameMap]: TagName extends SpecialPropTagNames
    ? keyof typeof EnumHtmlAttributes[TagName]
    : EnumHtmlAttributes.GeneralAttributes
}
type BaseProps<T extends keyof HTMLElementTagNameMap> = {
  [prop in Exclude<HtmlElementTagNameAttributesMap[T], "style">]?: string
}
type EvtName<EvtType extends keyof HTMLElementEventMap> =
  `on${Capitalize<EvtType>}`
type EvtListener<
  EvtType extends keyof HTMLElementEventMap,
  TagName extends keyof HTMLElementTagNameMap
> = EventListener &
  ((
    this: HTMLElementTagNameMap[TagName],
    evt: HTMLElementEventMap[EvtType] & {
      target: HTMLElementTagNameMap[TagName]
    }
  ) => void)
type Style = { [prop in keyof CSSStyleDeclaration]?: string }
type Props<TagName extends keyof HTMLElementTagNameMap> = BaseProps<TagName> & {
  [EvtType in keyof HTMLElementEventMap as EvtName<EvtType>]?: EvtListener<
    EvtType,
    TagName
  >
} & { style?: Style }
export type { Props, SpecialPropTagNames, Style, EvtListener }
