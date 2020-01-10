import { Workbench } from 'jeepney/workbench/workbench';
import { ElectronWindow } from 'jeepney/workbench/electron-browser/window';
import { ServiceCollection } from 'jeepney/platform/instantiation/common/serviceCollection';
import { Disposable } from 'jeepney/base/common/lifecycle';
import { IMainProcessService, MainProcessService } from 'jeepney/platform/ipc/mainProcessService';
import { StorageService } from 'jeepney/platform/storage/common/storageService';
import { GlobalStorageDatabaseChannelClient } from 'jeepney/platform/storage/common/storageIpc';
import { IStorageService } from 'jeepney/platform/storage/common/storage';
import { WorkbenchEnvironmentService, IWorkbenchEnvironmentService } from 'jeepney/workbench/services/environment/common/environmentService';
import { IWindowConfiguration } from 'jeepney/platform/windows/common/windows';
import { IWorkspaceInitializationPayload } from 'jeepney/platform/workspaces/common/workspaces';
import { IConfigurationService } from 'jeepney/platform/configuration/common/configuration';
import { WorkspaceService } from 'jeepney/workbench/services/configuration/browser/configurationService';
import { IWorkspaceContextService } from 'jeepney/platform/workspace/common/workspace';

export class JeepneyRendererMain extends Disposable {

    private workbench : Workbench;
    private readonly environmentService: WorkbenchEnvironmentService;

    constructor(configuration: IWindowConfiguration) {
        super();
        this.environmentService = new WorkbenchEnvironmentService(configuration, configuration.execPath);
    }

    async open() : Promise<void> {

        const services = await this.initServices();

        // Create workbench
        this.workbench = new Workbench(document.body, services.serviceCollection);

        // Startup
        const instantiationService = this.workbench.startup();
        
        // Window
        this._register(instantiationService.createInstance(ElectronWindow));

    }

    private async initServices() : Promise<{ serviceCollection : ServiceCollection }> {
        const serviceCollection = new ServiceCollection();

        // Main Process
		const mainProcessService = this._register(new MainProcessService(this.environmentService.configuration.windowId));
        serviceCollection.set(IMainProcessService, mainProcessService);

        // Environment
        serviceCollection.set(IWorkbenchEnvironmentService, this.environmentService);
        
        const payload : IWorkspaceInitializationPayload = {id: null, folder: null};

        const services = await Promise.all([
            this.createWorkspaceService(payload).then(service => {

                // Workspace
                serviceCollection.set(IWorkspaceContextService, service);

                // Configuration
                serviceCollection.set(IConfigurationService, service);

                return service;
            }),

            this.createStorageService(payload, mainProcessService).then(service => {

                // Storage
                serviceCollection.set(IStorageService, service);

                return service;
            })
        ]);

        return { serviceCollection };
    }

    private async createWorkspaceService(payload: IWorkspaceInitializationPayload): Promise<WorkspaceService> {
        const workspaceService = new WorkspaceService();
        return workspaceService;
    }

    private async createStorageService(payload: IWorkspaceInitializationPayload, mainProcessService: IMainProcessService): Promise<StorageService> {
        const globalStorageDatabase = new GlobalStorageDatabaseChannelClient(mainProcessService.getChannel('storage'));
        const storageService = new StorageService(globalStorageDatabase);

        try {
            await storageService.initialize(payload);
        } catch (error) {
            return storageService;
        }

        return storageService;
    }

}

export function main(configuration: IWindowConfiguration) : Promise<void> {
    const renderer = new JeepneyRendererMain(configuration);
    return renderer.open();
}