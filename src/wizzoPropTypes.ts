import type { EnumHtmlAttributes } from "html-element-attributes-typescript"
import type { WizzoEventMap } from "./eventMap"

type SpecialPropTagNames = keyof typeof EnumHtmlAttributes
type HtmlElementTagNameAttributesMap = {
  [TagName in keyof HTMLElementTagNameMap]: TagName extends SpecialPropTagNames
    ? keyof typeof EnumHtmlAttributes[TagName]
    : EnumHtmlAttributes.GeneralAttributes
}
type BaseProps<T extends keyof HTMLElementTagNameMap> = {
  [prop in Exclude<HtmlElementTagNameAttributesMap[T], "style">]?: string
}

type Style = { [prop in keyof CSSStyleDeclaration]?: string }
type Props<TagName extends keyof HTMLElementTagNameMap> = BaseProps<TagName> &
  Partial<WizzoEventMap<HTMLElementTagNameMap[TagName]>> & { style?: Style }
export type { Props, SpecialPropTagNames, Style }
