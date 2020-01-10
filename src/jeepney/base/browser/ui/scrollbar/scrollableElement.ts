import { Widget } from 'jeepney/base/browser/ui/widget';
import { INewScrollDimensions, INewScrollPosition, IScrollPosition, Scrollable } from 'jeepney/base/common/scrollable';

export abstract class AbstractScrollableElement extends Widget {

    protected readonly _scrollable: Scrollable;
    private _revealOnScroll: boolean;

    public setScrollDimensions(dimensions: INewScrollDimensions): void {
		this._scrollable.setScrollDimensions(dimensions);
	}

    public setRevealOnScroll(value: boolean) {
		this._revealOnScroll = value;
	}

}

export class ScrollableElement extends AbstractScrollableElement {

    public setScrollPosition(update: INewScrollPosition): void {
		this._scrollable.setScrollPositionNow(update);
	}

	public getScrollPosition(): IScrollPosition {
		return this._scrollable.getCurrentScrollPosition();
	}

}

export class DomScrollableElement extends ScrollableElement {

    private _element: HTMLElement;

    public scanDomNode(): void {
		// width, scrollLeft, scrollWidth, height, scrollTop, scrollHeight
		this.setScrollDimensions({
			width: this._element.clientWidth,
			scrollWidth: this._element.scrollWidth,
			height: this._element.clientHeight,
			scrollHeight: this._element.scrollHeight
		});
		this.setScrollPosition({
			scrollLeft: this._element.scrollLeft,
			scrollTop: this._element.scrollTop,
		});
	}

}