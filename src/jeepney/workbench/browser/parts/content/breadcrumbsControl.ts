import * as dom from 'jeepney/base/browser/dom';
import { BreadcrumbsWidget } from 'jeepney/base/browser/ui/breadcrumbs/breadcrumbsWidget';

export class BreadcrumbsControl {

    static HEIGHT = 22;

    readonly domNode: HTMLDivElement;
    private readonly _widget: BreadcrumbsWidget;

    layout(dim: dom.Dimension | undefined): void {
		this._widget.layout(dim);
	}

    isHidden(): boolean {
		return dom.hasClass(this.domNode, 'hidden');
	}

}