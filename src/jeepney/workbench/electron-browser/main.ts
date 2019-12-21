import { Workbench } from 'jeepney/workbench/workbench';
import { ElectronWindow } from 'jeepney/workbench/electron-browser/window';
import { ServiceCollection } from 'jeepney/platform/instantiation/common/serviceCollection';
import { Disposable } from 'jeepney/base/common/lifecycle';

export class JeepneyRendererMain extends Disposable {

    private workbench : Workbench;

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
        return { serviceCollection };
    }

}

export function main() : Promise<void> {
    const renderer = new JeepneyRendererMain();
    return renderer.open();
}