import { DisposableStore, IDisposable } from 'jeepney/base/common/lifecycle';
import { DomScrollableElement } from 'jeepney/base/browser/ui/scrollbar/scrollableElement';
import * as dom from 'jeepney/base/browser/dom';

export class BreadcrumbsWidget {

    private readonly _disposables = new DisposableStore();
    private readonly _domNode: HTMLDivElement;
    private readonly _scrollable: DomScrollableElement;

    private _pendingLayout: IDisposable;
	private _dimension: dom.Dimension;

    layout(dim: dom.Dimension | undefined): void {
		if (dim && dom.Dimension.equals(dim, this._dimension)) {
			return;
		}
		if (this._pendingLayout) {
			this._pendingLayout.dispose();
		}
		if (dim) {
			// only measure
			this._pendingLayout = this._updateDimensions(dim);
		} else {
			this._pendingLayout = this._updateScrollbar();
		}
    }
    
    private _updateDimensions(dim: dom.Dimension): IDisposable {
		const disposables = new DisposableStore();
		disposables.add(dom.modify(() => {
			this._dimension = dim;
			this._domNode.style.width = `${dim.width}px`;
			this._domNode.style.height = `${dim.height}px`;
			disposables.add(this._updateScrollbar());
		}));
		return disposables;
	}

	private _updateScrollbar(): IDisposable {
		return dom.measure(() => {
			dom.measure(() => { // double RAF
				this._scrollable.setRevealOnScroll(false);
				this._scrollable.scanDomNode();
				this._scrollable.setRevealOnScroll(true);
			});
		});
	}

}