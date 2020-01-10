import { createDecorator } from 'jeepney/platform/instantiation/common/instantiation';
import { Part } from 'jeepney/workbench/browser/part';
import { Parts } from 'jeepney/workbench/services/part/common/partService';
import { MenuBarVisibility } from 'jeepney/platform/windows/common/windows';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');

export interface IDimension {
	readonly width: number;
	readonly height: number;
}

export interface ILayoutService {

    _serviceBrand: any;

}

export interface ILayoutOptions {
	toggleMaximizedPanel?: boolean;
	source?: Parts;
}

export const IWorkbenchLayoutService = createDecorator<IWorkbenchLayoutService>('layoutService');

export interface IWorkbenchLayoutService extends ILayoutService {

	_serviceBrand: any;
	
	/**
	 * Returns if the part is visible.
	 */
	isVisible(part: Parts): boolean;

	/**
	 * Gets the current menubar visibility.
	 */
	getMenubarVisibility(): MenuBarVisibility;

    /**
	 * Returns the element that is parent of the workbench element.
	 */
	getWorkbenchContainer(): HTMLElement;

    /**
	 * Register a part to participate in the layout.
	 */
	registerPart(part: Part): void;

}