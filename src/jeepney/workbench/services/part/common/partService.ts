import { createDecorator, ServiceIdentifier } from 'jeepney/platform/instantiation/common/instantiation';

export const enum Parts {
    TITLEBAR_PART = 'workbench.parts.titlebar',
	ACTIVITYBAR_PART = 'workbench.parts.activitybar',
	SIDEBAR_PART = 'workbench.parts.sidebar',
	PANEL_PART = 'workbench.parts.panel',
    EDITOR_PART = 'workbench.parts.editor',
    CONTENT_PART = 'workbench.parts.content',
	STATUSBAR_PART = 'workbench.parts.statusbar'
}

export const IPartService = createDecorator<IPartService>('partService');

export interface IPartService {
    _serviceBrand: ServiceIdentifier<any>;

    /**
	 * Returns if the part is visible.
	 */
	isVisible(part: Parts): boolean;

}