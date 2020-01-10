import { Event } from 'jeepney/base/common/event';
import { clamp } from 'jeepney/base/common/numbers';
import { range } from 'jeepney/base/common/arrays';
import { Orientation } from 'jeepney/base/browser/ui/sash/sash';
import { Disposable, IDisposable } from 'jeepney/base/common/lifecycle';
import * as dom from 'jeepney/base/browser/dom';

/**
 * Only used when `proportionalLayout` is false.
 */
export const enum LayoutPriority {
	Normal,
	Low,
	High
}

export interface IView {
	readonly element: HTMLElement;
	readonly minimumSize: number;
	readonly maximumSize: number;
	readonly onDidChange: Event<number | undefined>;
	readonly priority?: LayoutPriority;
	readonly snap?: boolean;
	layout(size: number, orientation: Orientation): void;
	setVisible?(visible: boolean): void;
}

type ViewItemSize = number | { cachedVisibleSize: number };

abstract class ViewItem {

    private _size: number;
	set size(size: number) {
		this._size = size;
	}

	get size(): number {
		return this._size;
    }

    private _cachedVisibleSize: number | undefined = undefined;
	get cachedVisibleSize(): number | undefined { return this._cachedVisibleSize; }

	get visible(): boolean {
		return typeof this._cachedVisibleSize === 'undefined';
	}

	set visible(visible: boolean) {
		if (visible === this.visible) {
			return;
		}

		if (visible) {
			this.size = clamp(this._cachedVisibleSize!, this.viewMinimumSize, this.viewMaximumSize);
			this._cachedVisibleSize = undefined;
		} else {
			this._cachedVisibleSize = this.size;
			this.size = 0;
		}

		dom.toggleClass(this.container, 'visible', visible);

		if (this.view.setVisible) {
			this.view.setVisible(visible);
		}
	}
    
    get minimumSize(): number { return this.visible ? this.view.minimumSize : 0; }
	get viewMinimumSize(): number { return this.view.minimumSize; }

	get maximumSize(): number { return this.visible ? this.view.maximumSize : 0; }
    get viewMaximumSize(): number { return this.view.maximumSize; }

    get priority(): LayoutPriority | undefined { return this.view.priority; }
    
    constructor(
		protected container: HTMLElement,
		private view: IView,
		size: ViewItemSize,
		private disposable: IDisposable
	) {
		if (typeof size === 'number') {
			this._size = size;
			this._cachedVisibleSize = undefined;
		} else {
			this._size = 0;
			this._cachedVisibleSize = size.cachedVisibleSize;
		}

		dom.addClass(container, 'visible');
	}

}

export class SplitView extends Disposable {

    private size = 0;
    private contentSize = 0;
    private proportions: undefined | number[] = undefined;
    private viewItems: ViewItem[] = [];

    get length(): number {
		return this.viewItems.length;
	}

    get minimumSize(): number {
		return this.viewItems.reduce((r, item) => r + item.minimumSize, 0);
    }
    
    get maximumSize(): number {
		return this.length === 0 ? Number.POSITIVE_INFINITY : this.viewItems.reduce((r, item) => r + item.maximumSize, 0);
    }
    
    layout(size: number): void {
	}

    dispose(): void {
        super.dispose();
    }

}