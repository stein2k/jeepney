import { createDecorator } from "jeepney/platform/instantiation/common/instantiation";

export const IWindowService = createDecorator<IWindowService>('windowService');

export interface IWindowService {

	_serviceBrand : any;

	readonly windowId : number;

}

export interface IWindowConfiguration {
	appRoot: string;
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