export type EventHandler = (node: Element, event?: Event) => void;
export type EventType = "show" | "hide" | "destroy" | "create";
export type ListenersRecord = Record<EventType, EventHandler[]>;

export class A11yDialog {
	constructor(element: Element);

	public $el: HTMLElement;

	public shown: boolean;

	private id: string

	private listeners: ListenersRecord;

	private openers: HTMLElement[];

	private closers: HTMLElement[];

	private previouslyFocused: null | HTMLElement;

	public show(event?: Event): A11yDialog;

	public hide(event?: Event): A11yDialog;

	public destroy(): A11yDialog;

	public on(type: EventType, handler: EventHandler): A11yDialog;

	public off(type: EventType, handler: EventHandler): A11yDialog;

	private fire(type: EventType, event: Event): void;

	private bindKeypress(event: Event): void;

	private maintainFocus(event: Event): void;
}
