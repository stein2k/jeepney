import { createDecorator, ServiceIdentifier } from 'jeepney/platform/instantiation/common/instantiation';
import { EnvironmentService, IEnvironmentService } from 'jeepney/platform/environment/common/environmentService';
import { IWindowConfiguration } from 'jeepney/platform/windows/common/windows';

export const IWorkbenchEnvironmentService = createDecorator<IWorkbenchEnvironmentService>('environmentService');

export interface IWorkbenchEnvironmentService extends IEnvironmentService {

    _serviceBrand: ServiceIdentifier<IEnvironmentService>;

    readonly configuration: IWindowConfiguration;
    
}

export class WorkbenchEnvironmentService extends EnvironmentService implements IWorkbenchEnvironmentService {

    _serviceBrand: any;

    constructor(
		private _configuration: IWindowConfiguration,
		execPath: string
	) {
		super(_configuration, execPath);
		this._configuration.backupWorkspaceResource = this._configuration.backupPath ? undefined : undefined;
	}

    get configuration(): IWindowConfiguration {
		return this._configuration;
	}

}