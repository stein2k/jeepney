import { Disposable, IDisposable } from 'jeepney/base/common/lifecycle';
import { Emitter, Event } from 'jeepney/base/common/event';

export interface ScrollEvent {
	width: number;
	scrollWidth: number;
	scrollLeft: number;

	height: number;
	scrollHeight: number;
	scrollTop: number;

	widthChanged: boolean;
	scrollWidthChanged: boolean;
	scrollLeftChanged: boolean;

	heightChanged: boolean;
	scrollHeightChanged: boolean;
	scrollTopChanged: boolean;
}

export class ScrollState implements IScrollDimensions, IScrollPosition {

    public readonly width: number;
	public readonly scrollWidth: number;
	public readonly scrollLeft: number;
	public readonly height: number;
	public readonly scrollHeight: number;
    public readonly scrollTop: number;

    constructor(
		width: number,
		scrollWidth: number,
		scrollLeft: number,
		height: number,
		scrollHeight: number,
		scrollTop: number
	) {
		width = width | 0;
		scrollWidth = scrollWidth | 0;
		scrollLeft = scrollLeft | 0;
		height = height | 0;
		scrollHeight = scrollHeight | 0;
		scrollTop = scrollTop | 0;

		if (width < 0) {
			width = 0;
		}
		if (scrollLeft + width > scrollWidth) {
			scrollLeft = scrollWidth - width;
		}
		if (scrollLeft < 0) {
			scrollLeft = 0;
		}

		if (height < 0) {
			height = 0;
		}
		if (scrollTop + height > scrollHeight) {
			scrollTop = scrollHeight - height;
		}
		if (scrollTop < 0) {
			scrollTop = 0;
		}

		this.width = width;
		this.scrollWidth = scrollWidth;
		this.scrollLeft = scrollLeft;
		this.height = height;
		this.scrollHeight = scrollHeight;
		this.scrollTop = scrollTop;
    }
    
    public equals(other: ScrollState): boolean {
		return (
			this.width === other.width
			&& this.scrollWidth === other.scrollWidth
			&& this.scrollLeft === other.scrollLeft
			&& this.height === other.height
			&& this.scrollHeight === other.scrollHeight
			&& this.scrollTop === other.scrollTop
		);
	}
    
    public withScrollDimensions(update: INewScrollDimensions): ScrollState {
		return new ScrollState(
			(typeof update.width !== 'undefined' ? update.width : this.width),
			(typeof update.scrollWidth !== 'undefined' ? update.scrollWidth : this.scrollWidth),
			this.scrollLeft,
			(typeof update.height !== 'undefined' ? update.height : this.height),
			(typeof update.scrollHeight !== 'undefined' ? update.scrollHeight : this.scrollHeight),
			this.scrollTop
		);
    }

    public withScrollPosition(update: INewScrollPosition): ScrollState {
		return new ScrollState(
			this.width,
			this.scrollWidth,
			(typeof update.scrollLeft !== 'undefined' ? update.scrollLeft : this.scrollLeft),
			this.height,
			this.scrollHeight,
			(typeof update.scrollTop !== 'undefined' ? update.scrollTop : this.scrollTop)
		);
	}
    
    public createScrollEvent(previous: ScrollState): ScrollEvent {
		const widthChanged = (this.width !== previous.width);
		const scrollWidthChanged = (this.scrollWidth !== previous.scrollWidth);
		const scrollLeftChanged = (this.scrollLeft !== previous.scrollLeft);

		const heightChanged = (this.height !== previous.height);
		const scrollHeightChanged = (this.scrollHeight !== previous.scrollHeight);
		const scrollTopChanged = (this.scrollTop !== previous.scrollTop);

		return {
			width: this.width,
			scrollWidth: this.scrollWidth,
			scrollLeft: this.scrollLeft,

			height: this.height,
			scrollHeight: this.scrollHeight,
			scrollTop: this.scrollTop,

			widthChanged: widthChanged,
			scrollWidthChanged: scrollWidthChanged,
			scrollLeftChanged: scrollLeftChanged,

			heightChanged: heightChanged,
			scrollHeightChanged: scrollHeightChanged,
			scrollTopChanged: scrollTopChanged,
		};
	}

}

export interface IScrollDimensions {
	readonly width: number;
	readonly scrollWidth: number;
	readonly height: number;
	readonly scrollHeight: number;
}

export interface INewScrollDimensions {
	width?: number;
	scrollWidth?: number;
	height?: number;
	scrollHeight?: number;
}

export interface IScrollPosition {
	readonly scrollLeft: number;
	readonly scrollTop: number;
}

export interface ISmoothScrollPosition {
	readonly scrollLeft: number;
	readonly scrollTop: number;
	readonly width: number;
	readonly height: number;
}

export interface INewScrollPosition {
	scrollLeft?: number;
	scrollTop?: number;
}

export class Scrollable extends Disposable {

    private _state: ScrollState;
    private _smoothScrolling: SmoothScrollingOperation | null;

    private _onScroll = this._register(new Emitter<ScrollEvent>());
	public readonly onScroll: Event<ScrollEvent> = this._onScroll.event;

    public setScrollDimensions(dimensions: INewScrollDimensions): void {
		const newState = this._state.withScrollDimensions(dimensions);
		this._setState(newState);

		// Validate outstanding animated scroll position target
		if (this._smoothScrolling) {
			this._smoothScrolling.acceptScrollDimensions(this._state);
		}
    }

    /**
	 * Returns the current scroll position.
	 * Note: This result might be an intermediate scroll position, as there might be an ongoing smooth scroll animation.
	 */
	public getCurrentScrollPosition(): IScrollPosition {
		return this._state;
	}

    public setScrollPositionNow(update: INewScrollPosition): void {
		// no smooth scrolling requested
		const newState = this._state.withScrollPosition(update);

		// Terminate any outstanding smooth scrolling
		if (this._smoothScrolling) {
			this._smoothScrolling.dispose();
			this._smoothScrolling = null;
		}

		this._setState(newState);
	}
    
    private _setState(newState: ScrollState): void {
		const oldState = this._state;
		if (oldState.equals(newState)) {
			// no change
			return;
		}
		this._state = newState;
		this._onScroll.fire(this._state.createScrollEvent(oldState));
	}

}

export interface IAnimation {
	(completion: number): number;
}

function createEaseOutCubic(from: number, to: number): IAnimation {
	const delta = to - from;
	return function (completion: number): number {
		return from + delta * easeOutCubic(completion);
	};
}

function createComposed(a: IAnimation, b: IAnimation, cut: number): IAnimation {
	return function (completion: number): number {
		if (completion < cut) {
			return a(completion / cut);
		}
		return b((completion - cut) / (1 - cut));
	};
}

export class SmoothScrollingOperation {

    public readonly from: ISmoothScrollPosition;
    public to: ISmoothScrollPosition;
    public animationFrameDisposable: IDisposable | null;

    private scrollLeft!: IAnimation;
	private scrollTop!: IAnimation;

    private _initAnimations(): void {
		this.scrollLeft = this._initAnimation(this.from.scrollLeft, this.to.scrollLeft, this.to.width);
		this.scrollTop = this._initAnimation(this.from.scrollTop, this.to.scrollTop, this.to.height);
	}

	private _initAnimation(from: number, to: number, viewportSize: number): IAnimation {
		const delta = Math.abs(from - to);
		if (delta > 2.5 * viewportSize) {
			let stop1: number, stop2: number;
			if (from < to) {
				// scroll to 75% of the viewportSize
				stop1 = from + 0.75 * viewportSize;
				stop2 = to - 0.75 * viewportSize;
			} else {
				stop1 = from - 0.75 * viewportSize;
				stop2 = to + 0.75 * viewportSize;
			}
			return createComposed(createEaseOutCubic(from, stop1), createEaseOutCubic(stop2, to), 0.33);
		}
		return createEaseOutCubic(from, to);
	}

    public acceptScrollDimensions(state: ScrollState): void {
		this.to = state.withScrollPosition(this.to);
		this._initAnimations();
    }
    
    public dispose(): void {
		if (this.animationFrameDisposable !== null) {
			this.animationFrameDisposable.dispose();
			this.animationFrameDisposable = null;
		}
	}

}

function easeInCubic(t: number) {
	return Math.pow(t, 3);
}

function easeOutCubic(t: number) {
	return 1 - easeInCubic(1 - t);
}