import { createDecorator } from 'jeepney/platform/instantiation/common/instantiation';
import { URI } from 'jeepney/base/common/uri';

export const IConfigurationService = createDecorator<IConfigurationService>('configurationService');

export function isConfigurationOverrides(thing: any): thing is IConfigurationOverrides {
	return thing
		&& typeof thing === 'object'
		&& (!thing.overrideIdentifier || typeof thing.overrideIdentifier === 'string')
		&& (!thing.resource || thing.resource instanceof URI);
}

export interface IConfigurationOverrides {
	overrideIdentifier?: string | null;
	resource?: URI | null;
}

export interface IConfigurationService {
    _serviceBrand: any;

    /**
	 * Fetches the value of the section for the given overrides.
	 * Value can be of native type or an object keyed off the section name.
	 *
	 * @param section - Section of the configuraion. Can be `null` or `undefined`.
	 * @param overrides - Overrides that has to be applied while fetching
	 *
	 */
	getValue<T>(): T;
	getValue<T>(section: string): T;
	getValue<T>(overrides: IConfigurationOverrides): T;
	getValue<T>(section: string, overrides: IConfigurationOverrides): T;

}

export interface IConfigurationModel {
	contents: any;
	keys: string[];
	overrides: IOverrides[];
}

export interface IOverrides {
	contents: any;
	identifiers: string[];
}