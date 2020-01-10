import 'jeepney/css!./menuView'
import * as DOM from 'jeepney/base/browser/dom';
import { Widget } from "jeepney/base/browser/ui/widget";
import { IMenuViewlet } from 'jeepney/workbench/contrib/menu/menuViewletActions';
import { IDisposable } from 'jeepney/base/common/lifecycle';

export interface IMenuViewItem extends IDisposable {
    render(element: HTMLElement): void;
}

export class MenuViewItem implements IMenuViewItem {

    element: HTMLElement | undefined;
    protected label: HTMLElement | undefined;

    constructor() {

    }

    render(container: HTMLElement): void {
        const element = this.element = container;

        if (element) {
            this.label = DOM.append(this.element, DOM.$('div.action-label'));
            this.label.setAttribute('role', 'button');
        }

    }

    dispose(): void {
    }

}

export class MenuViewlet extends Widget implements IMenuViewlet {

    private dimension: DOM.Dimension;

    private parent: HTMLElement;
    private content: HTMLElement;

    // Elements
    protected menuOptions: HTMLElement;

    constructor() {
        super();
    }

    create(parent: HTMLElement): HTMLElement {
        this.parent = parent;
        this.content = parent.appendChild(DOM.$('.menu-viewlet'));

        this.menuOptions = this.content.appendChild(DOM.$('ul'));
        this.menuOptions.className = 'actions-container';

        [
            { id: 0 }
        ].forEach(({ id }) => {

            const menuViewItemElement = document.createElement('li');
            menuViewItemElement.className = 'menu-item';

            let item: IMenuViewItem | undefined;

            item = new MenuViewItem();
            item.render(menuViewItemElement);

            // add menu item to menu options list
            this.menuOptions.appendChild(menuViewItemElement);

        })

        // const item = document.createElement('li');
        // this.menuOptions.appendChild(item);

        // item.label = $('a')

        // this.content.appendChild(this.menuOptions);

        return this.content;

    }

    layout(dimension: DOM.Dimension): void {
        this.dimension = dimension;
        if (dimension.height === 0 || dimension.width === 0) {
			// Do not layout if not visible. Otherwise the size measurment would be computed wrongly
			return;
        }

        const { width, height } = dimension;

        this.content.style.left = '0px';
        this.content.style.top = '0px';
        this.content.style.position = 'absolute';
        this.content.style.backgroundColor = 'magenta';
        DOM.size(this.content, 48, height);

    }

}