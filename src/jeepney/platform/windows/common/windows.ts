import { createDecorator } from 'jeepney/platform/instantiation/common/instantiation';
import { ParsedArgs, IEnvironmentService } from 'jeepney/platform/environment/common/environmentService';
import { IConfigurationService } from 'jeepney/platform/configuration/common/configuration';
import { isMacintosh, isLinux, isWeb } from 'jeepney/base/common/platform';
import { URI } from 'jeepney/base/common/uri';

export const IWindowService = createDecorator<IWindowService>('windowService');

export interface IWindowService {

	_serviceBrand : any;

	readonly windowId : number;

}

export type MenuBarVisibility = 'default' | 'visible' | 'toggle' | 'hidden';

export interface IWindowConfiguration extends ParsedArgs {
	windowId: number;

	appRoot: string;
	execPath: string;

	backupPath?: string;
	backupWorkspaceResource?: URI;
	
}

export interface IWindowSettings {
}

export const enum ReadyState {

	/**
	 * This window has not loaded any HTML yet
	 */
	NONE,

	/**
	 * This window is loading HTML
	 */
	LOADING,

	/**
	 * This window is navigating to another HTML
	 */
	NAVIGATING,

	/**
	 * This window is done loading HTML
	 */
	READY
}

export interface IWindowsMainService {

	_serviceBrand : any;

}

export function getTitleBarStyle(configurationService: IConfigurationService, environment: IEnvironmentService, isExtensionDevelopment = environment.isExtensionDevelopment ): 'native' | 'custom' {

	const configuration = configurationService.getValue<IWindowSettings>('window');

	const isDev = !environment.isBuilt || isExtensionDevelopment;
	if (isMacintosh && isDev) {
		return 'native'; // not enabled when developing due to https://github.com/electron/electron/issues/3647
	}

	if (configuration) {
	}

	return isLinux ? 'native' : 'custom';

}