export type EvtListener<
  EvtType extends Event,
  ElementType extends HTMLElement
> = (this: ElementType, evt: EvtType & { target: ElementType }) => void

/**
 * A map of many common event names, camel cased and
 * prefixed with "on", to event listener types.
 */
export interface WizzoEventMap<ElementType extends HTMLElement> {
  onAnimationEnd: EvtListener<AnimationEvent, ElementType>
  onAnimationIteration: EvtListener<AnimationEvent, ElementType>
  onAnimationStart: EvtListener<AnimationEvent, ElementType>

  onBeforeInput: EvtListener<InputEvent, ElementType>
  onChange: EvtListener<Event, ElementType>
  onInput: EvtListener<InputEvent, ElementType>

  onMouseDown: EvtListener<MouseEvent, ElementType>
  onMouseEnter: EvtListener<MouseEvent, ElementType>
  onMouseLeave: EvtListener<MouseEvent, ElementType>
  onMouseMove: EvtListener<MouseEvent, ElementType>
  onMouseOut: EvtListener<MouseEvent, ElementType>
  onMouseOver: EvtListener<MouseEvent, ElementType>
  onMouseUp: EvtListener<MouseEvent, ElementType>

  onScroll: EvtListener<Event, ElementType>

  onBlur: EvtListener<FocusEvent, ElementType>
  onClick: EvtListener<MouseEvent, ElementType>
  onDblClick: EvtListener<MouseEvent, ElementType>

  onFocusIn: EvtListener<FocusEvent, ElementType>
  onFocusOut: EvtListener<FocusEvent, ElementType>
  onFocus: EvtListener<FocusEvent, ElementType>

  onSubmit: EvtListener<SubmitEvent, ElementType>
  onFormData: EvtListener<FormDataEvent, ElementType>
}
