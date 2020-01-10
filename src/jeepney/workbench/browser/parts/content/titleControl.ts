import { Dimension } from 'jeepney/base/browser/dom';
import { Themable } from 'jeepney/workbench/common/theme';
import { CONTENT_TITLE_HEIGHT } from 'jeepney/workbench/browser/parts/content/content';
import { BreadcrumbsControl } from 'jeepney/workbench/browser/parts/content/breadcrumbsControl';

export abstract class TitleControl extends Themable {

    protected breadcrumbsControl?: BreadcrumbsControl;

    layout(dimension: Dimension): void {
		if (this.breadcrumbsControl) {
			this.breadcrumbsControl.layout(undefined);
		}
	}

    getPreferredHeight(): number {
        return CONTENT_TITLE_HEIGHT + (this.breadcrumbsControl && !this.breadcrumbsControl.isHidden() ? BreadcrumbsControl.HEIGHT : 0);
    }

}