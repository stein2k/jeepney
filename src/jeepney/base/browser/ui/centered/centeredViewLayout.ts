import { IDisposable } from 'jeepney/base/common/lifecycle';
import { IView } from 'jeepney/base/browser/ui/grid/grid';

export class CenteredViewLayout implements IDisposable {

    constructor(private container: HTMLElement, private view: IView) {
        this.container.appendChild(this.view.element);
        this.container.style.overflow = 'hidden';
    }

	dispose(): void {
	}

}