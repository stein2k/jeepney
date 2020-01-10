import * as browser from 'jeepney/base/browser/browser';
import { CharCode } from 'jeepney/base/common/charCode';
import { coalesce } from 'jeepney/base/common/arrays';
import { IDisposable } from 'jeepney/base/common/lifecycle';

interface IDomClassList {
	hasClass(node: HTMLElement | SVGElement, className: string): boolean;
	addClass(node: HTMLElement | SVGElement, className: string): void;
	addClasses(node: HTMLElement | SVGElement, ...classNames: string[]): void;
	removeClass(node: HTMLElement | SVGElement, className: string): void;
	removeClasses(node: HTMLElement | SVGElement, ...classNames: string[]): void;
	toggleClass(node: HTMLElement | SVGElement, className: string, shouldHaveIt?: boolean): void;
}

const _manualClassList = new class implements IDomClassList {

	private _lastStart: number;
	private _lastEnd: number;

	private _findClassName(node: HTMLElement, className: string): void {

		let classes = node.className;
		if (!classes) {
			this._lastStart = -1;
			return;
		}

		className = className.trim();

		let classesLen = classes.length,
			classLen = className.length;

		if (classLen === 0) {
			this._lastStart = -1;
			return;
		}

		if (classesLen < classLen) {
			this._lastStart = -1;
			return;
		}

		if (classes === className) {
			this._lastStart = 0;
			this._lastEnd = classesLen;
			return;
		}

		let idx = -1,
			idxEnd: number;

		while ((idx = classes.indexOf(className, idx + 1)) >= 0) {

			idxEnd = idx + classLen;

			// a class that is followed by another class
			if ((idx === 0 || classes.charCodeAt(idx - 1) === CharCode.Space) && classes.charCodeAt(idxEnd) === CharCode.Space) {
				this._lastStart = idx;
				this._lastEnd = idxEnd + 1;
				return;
			}

			// last class
			if (idx > 0 && classes.charCodeAt(idx - 1) === CharCode.Space && idxEnd === classesLen) {
				this._lastStart = idx - 1;
				this._lastEnd = idxEnd;
				return;
			}

			// equal - duplicate of cmp above
			if (idx === 0 && idxEnd === classesLen) {
				this._lastStart = 0;
				this._lastEnd = idxEnd;
				return;
			}
		}

		this._lastStart = -1;
	}

	hasClass(node: HTMLElement, className: string): boolean {
		this._findClassName(node, className);
		return this._lastStart !== -1;
	}

	addClasses(node: HTMLElement, ...classNames: string[]): void {
		classNames.forEach(nameValue => nameValue.split(' ').forEach(name => this.addClass(node, name)));
	}

	addClass(node: HTMLElement, className: string): void {
		if (!node.className) { // doesn't have it for sure
			node.className = className;
		} else {
			this._findClassName(node, className); // see if it's already there
			if (this._lastStart === -1) {
				node.className = node.className + ' ' + className;
			}
		}
	}

	removeClass(node: HTMLElement, className: string): void {
		this._findClassName(node, className);
		if (this._lastStart === -1) {
			return; // Prevent styles invalidation if not necessary
		} else {
			node.className = node.className.substring(0, this._lastStart) + node.className.substring(this._lastEnd);
		}
	}

	removeClasses(node: HTMLElement, ...classNames: string[]): void {
		classNames.forEach(nameValue => nameValue.split(' ').forEach(name => this.removeClass(node, name)));
	}

	toggleClass(node: HTMLElement, className: string, shouldHaveIt?: boolean): void {
		this._findClassName(node, className);
		if (this._lastStart !== -1 && (shouldHaveIt === undefined || !shouldHaveIt)) {
			this.removeClass(node, className);
		}
		if (this._lastStart === -1 && (shouldHaveIt === undefined || shouldHaveIt)) {
			this.addClass(node, className);
		}
	}
};

const _nativeClassList = new class implements IDomClassList {
	hasClass(node: HTMLElement, className: string): boolean {
		return Boolean(className) && node.classList && node.classList.contains(className);
	}

	addClasses(node: HTMLElement, ...classNames: string[]): void {
		classNames.forEach(nameValue => nameValue.split(' ').forEach(name => this.addClass(node, name)));
	}

	addClass(node: HTMLElement, className: string): void {
		if (className && node.classList) {
			node.classList.add(className);
		}
	}

	removeClass(node: HTMLElement, className: string): void {
		if (className && node.classList) {
			node.classList.remove(className);
		}
	}

	removeClasses(node: HTMLElement, ...classNames: string[]): void {
		classNames.forEach(nameValue => nameValue.split(' ').forEach(name => this.removeClass(node, name)));
	}

	toggleClass(node: HTMLElement, className: string, shouldHaveIt?: boolean): void {
		if (node.classList) {
			node.classList.toggle(className, shouldHaveIt);
		}
	}
};

// In IE11 there is only partial support for `classList` which makes us keep our
// custom implementation. Otherwise use the native implementation, see: http://caniuse.com/#search=classlist
const _classList: IDomClassList = browser.isIE ? _manualClassList : _nativeClassList;
export const hasClass: (node: HTMLElement | SVGElement, className: string) => boolean = _classList.hasClass.bind(_classList);
export const addClass: (node: HTMLElement | SVGElement, className: string) => void = _classList.addClass.bind(_classList);
export const addClasses: (node: HTMLElement | SVGElement, ...classNames: string[]) => void = _classList.addClasses.bind(_classList);
export const removeClass: (node: HTMLElement | SVGElement, className: string) => void = _classList.removeClass.bind(_classList);
export const removeClasses: (node: HTMLElement | SVGElement, ...classNames: string[]) => void = _classList.removeClasses.bind(_classList);
export const toggleClass: (node: HTMLElement | SVGElement, className: string, shouldHaveIt?: boolean) => void = _classList.toggleClass.bind(_classList);

/**
 * Schedule a callback to be run at the next animation frame.
 * This allows multiple parties to register callbacks that should run at the next animation frame.
 * If currently in an animation frame, `runner` will be executed at the next animation frame.
 * @return token that can be used to cancel the scheduled runner.
 */
export let scheduleAtNextAnimationFrame: (runner: () => void, priority?: number) => IDisposable;

export function measure(callback: () => void): IDisposable {
	return scheduleAtNextAnimationFrame(callback, 10000 /* must be early */);
}

export function modify(callback: () => void): IDisposable {
	return scheduleAtNextAnimationFrame(callback, -10000 /* must be late */);
}

const SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;

export enum Namespace {
	HTML = 'http://www.w3.org/1999/xhtml',
	SVG = 'http://www.w3.org/2000/svg'
}

function _$<T extends Element>(namespace: Namespace, description: string, attrs?: { [key: string]: any; }, ...children: Array<Node | string>): T {
	let match = SELECTOR_REGEX.exec(description);

	if (!match) {
		throw new Error('Bad use of emmet');
	}

	attrs = { ...(attrs || {}) };

	let tagName = match[1] || 'div';
	let result: T;

	if (namespace !== Namespace.HTML) {
		result = document.createElementNS(namespace as string, tagName) as T;
	} else {
		result = document.createElement(tagName) as unknown as T;
	}

	if (match[3]) {
		result.id = match[3];
	}
	if (match[4]) {
		result.className = match[4].replace(/\./g, ' ').trim();
	}

	Object.keys(attrs).forEach(name => {
		const value = attrs![name];
		if (/^on\w+$/.test(name)) {
			(<any>result)[name] = value;
		} else if (name === 'selected') {
			if (value) {
				result.setAttribute(name, 'true');
			}

		} else {
			result.setAttribute(name, value);
		}
	});

	coalesce(children)
		.forEach(child => {
			if (child instanceof Node) {
				result.appendChild(child);
			} else {
				result.appendChild(document.createTextNode(child as string));
			}
		});

	return result as T;
}

export function $<T extends HTMLElement>(description: string, attrs?: { [key: string]: any; }, ...children: Array<Node | string>): T {
	return _$(Namespace.HTML, description, attrs, ...children);
}

// ----------------------------------------------------------------------------------------
// Position & Dimension

export class Dimension {
	public width: number;
	public height: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	static equals(a: Dimension | undefined, b: Dimension | undefined): boolean {
		if (a === b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		return a.width === b.width && a.height === b.height;
	}
}

export function size(element: HTMLElement, width: number | null, height: number | null): void {
	if (typeof width === 'number') {
		element.style.width = `${width}px`;
	}

	if (typeof height === 'number') {
		element.style.height = `${height}px`;
	}
}

export function position(element: HTMLElement, top: number, right?: number, bottom?: number, left?: number, position: string = 'absolute'): void {
	if (typeof top === 'number') {
		element.style.top = `${top}px`;
	}

	if (typeof right === 'number') {
		element.style.right = `${right}px`;
	}

	if (typeof bottom === 'number') {
		element.style.bottom = `${bottom}px`;
	}

	if (typeof left === 'number') {
		element.style.left = `${left}px`;
	}

	element.style.position = position;
}

export function getClientArea(element: HTMLElement): Dimension {

	// Try with DOM clientWidth / clientHeight
	if (element !== document.body) {
		return new Dimension(element.clientWidth, element.clientHeight);
	}

	// Try innerWidth / innerHeight
	if (window.innerWidth && window.innerHeight) {
		return new Dimension(window.innerWidth, window.innerHeight);
	}

	// Try with document.body.clientWidth / document.body.clientHeight
	if (document.body && document.body.clientWidth && document.body.clientHeight) {
		return new Dimension(document.body.clientWidth, document.body.clientHeight);
	}

	// Try with document.documentElement.clientWidth / document.documentElement.clientHeight
	if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight) {
		return new Dimension(document.documentElement.clientWidth, document.documentElement.clientHeight);
	}

	throw new Error('Unable to figure out browser width and height');
}

export function append<T extends Node>(parent: HTMLElement, ...children: T[]): T {
	children.forEach(child => parent.appendChild(child));
	return children[children.length - 1];
}