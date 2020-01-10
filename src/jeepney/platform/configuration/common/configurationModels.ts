import * as objects from 'jeepney/base/common/objects';
import { IConfigurationModel, IOverrides, IConfigurationOverrides } from 'jeepney/platform//configuration/common/configuration';
import { Workspace } from 'jeepney/platform/workspace/common/workspace';

export class ConfigurationModel implements IConfigurationModel {

    private isFrozen: boolean = false;

    constructor(
        private _contents: any = {},
        private _keys: string[] = [],
        private _overrides: IOverrides[] = []
    ) {}

    get contents(): any {
		return this.checkAndFreeze(this._contents);
	}

    get overrides(): IOverrides[] {
		return this.checkAndFreeze(this._overrides);
	}

	get keys(): string[] {
		return this.checkAndFreeze(this._keys);
    }
    
    private checkAndFreeze<T>(data: T): T {
		if (this.isFrozen && !Object.isFrozen(data)) {
			return objects.deepFreeze(data);
		}
		return data;
	}

}

export class Configuration {

    getValue(section: string | undefined, overrides: IConfigurationOverrides, workspace: Workspace | undefined): any {
		return null;
    }
    
}