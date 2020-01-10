import { Configuration as BaseConfiguration } from 'jeepney/platform/configuration/common/configurationModels';
import { IConfigurationOverrides } from 'jeepney/platform/configuration/common/configuration';
import { Workspace } from 'jeepney/platform/workspace/common/workspace';

export class Configuration extends BaseConfiguration {

    constructor(
        private readonly _workspace?: Workspace ) {
            super();
        }

    getValue(key: string | undefined, overrides: IConfigurationOverrides = {}): any {
		return super.getValue(key, overrides, this._workspace);
	}

}