import { IConfigurationService, IConfigurationOverrides, isConfigurationOverrides } from 'jeepney/platform/configuration/common/configuration';
import { IWorkspaceContextService, Workspace } from 'jeepney/platform/workspace/common/workspace';
import { Disposable } from 'jeepney/base/common/lifecycle';
import { Configuration } from 'jeepney/workbench/services/configuration/common/configurationModels';

export class WorkspaceService extends Disposable implements IConfigurationService, IWorkspaceContextService {

    public _serviceBrand: any;

    private workspace: Workspace;
    private _configuration: Configuration;

    constructor() {
        super();
        this._configuration = new Configuration(this.workspace);
    }

    getValue<T>(): T;
	getValue<T>(section: string): T;
	getValue<T>(overrides: IConfigurationOverrides): T;
	getValue<T>(section: string, overrides: IConfigurationOverrides): T;
	getValue(arg1?: any, arg2?: any): any {
		const section = typeof arg1 === 'string' ? arg1 : undefined;
		const overrides = isConfigurationOverrides(arg1) ? arg1 : isConfigurationOverrides(arg2) ? arg2 : undefined;
		return this._configuration.getValue(section, overrides);
	}

}