import { createDecorator } from "jeepney/platform/instantiation/common/instantiation";
import { Part } from 'jeepney/workbench/browser/part';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');

export interface ILayoutService {

    _serviceBrand: any;

}

export const enum Parts {
    TITLEBAR_PART = 'workbench.parts.titlebar',
	ACTIVITYBAR_PART = 'workbench.parts.activitybar',
	SIDEBAR_PART = 'workbench.parts.sidebar',
	PANEL_PART = 'workbench.parts.panel',
    EDITOR_PART = 'workbench.parts.editor',
    CONTENT_PART = 'workbench.parts.content',
	STATUSBAR_PART = 'workbench.parts.statusbar'
}

export const IWorkbenchLayoutService = createDecorator<IWorkbenchLayoutService>('layoutService');

export interface IWorkbenchLayoutService extends ILayoutService {

    _serviceBrand: any;

    /**
	 * Returns the element that is parent of the workbench element.
	 */
	getWorkbenchContainer(): HTMLElement;

    /**
	 * Register a part to participate in the layout.
	 */
	registerPart(part: Part): void;

}