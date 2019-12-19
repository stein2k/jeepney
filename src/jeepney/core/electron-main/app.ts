
import { ipcMain as ipc, IpcMainEvent } from 'electron';
import { JeepneyWindow } from 'jeepney/core/electron-main/window';
import { IJeepneyWindow } from 'jeepney/platform/windows/electron-main/windows';
import { ILifecycleService, LifecyclePhase } from 'jeepney/platform/lifecycle/lifecycle';
import { Disposable } from 'jeepney/base/common/lifecycle';
import { IInstantiationService, ServicesAccessor } from 'jeepney/platform/instantiation/common/instantiation';
import { ServiceCollection } from 'jeepney/platform/instantiation/common/serviceCollection';

export class JeepneyApplication extends Disposable {

    private windowMain : IJeepneyWindow | undefined;

    constructor (
        @IInstantiationService private readonly instantiationService: IInstantiationService,
        @ILifecycleService private readonly lifecycleService: ILifecycleService)
    { 
        super(); 

        this.registerListeners();
    }

    private openFirstWindow(accessor : ServicesAccessor) : IJeepneyWindow[] {

        // create main window instance
        this.windowMain = new JeepneyWindow;

        // Signal phase: ready (services set)
		this.lifecycleService.phase = LifecyclePhase.Ready;

        return [this.windowMain];

    }

    async startup() : Promise<void> {

        // Services
        const appInstantiationService = await this.createServices();

        // Open Windows
        const windows = appInstantiationService.invokeFunction(accessor => this.openFirstWindow(accessor));

    }

    private async createServices() {

        // local declarations
        const services = new ServiceCollection();

        return this.instantiationService.createChild(services);

    }

    private registerListeners() : void {

        ipc.on('vscode:fetchShellEnv', async (event: IpcMainEvent) => {
            const webContents = event.sender;
            if (!webContents.isDestroyed()) {
                webContents.send('vscode:acceptShellEnv', {});
            }
        });

        ipc.on('jeepney:workbenchReady', async (event : IpcMainEvent) => {
            const webContents = event.sender;
            console.log('jeepney:workbencReady');
        });

    }

};