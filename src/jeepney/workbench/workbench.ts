import { Disposable } from "jeepney/base/common/lifecycle";
import { ServiceCollection } from "jeepney/platform/instantiation/common/serviceCollection";
import { IInstantiationService } from "jeepney/platform/instantiation/common/instantiation";
import { InstantiationService } from "jeepney/platform/instantiation/common/instantiationService";
import { ILifecycleService, LifecyclePhase } from "jeepney/platform/lifecycle/lifecycle";
import { getSingletonServiceDescriptors } from 'jeepney/platform/instantiation/common/extensions';
import { IWorkbenchLayoutService } from "jeepney/workbench/services/layoutService";
import { Layout } from 'jeepney/workbench/browser/layout';

export class Workbench extends Layout {

    private instantiationService: IInstantiationService;
    private lifecycleService: ILifecycleService;

    constructor (
        parent: HTMLElement,
        private readonly serviceCollection : ServiceCollection
    ) {
        super(parent);
    }

    startup() : IInstantiationService {

        // Services
        const instantiationService = this.initServices(this.serviceCollection);

        instantiationService.invokeFunction(async accessor => {

            // Initialize Workbench Layout
            this.initLayout(accessor);

            // Create Workbench Layout
            this.createWorkbenchLayout(instantiationService);

        });

        return instantiationService;

    }

    private initServices(serviceCollection : ServiceCollection) : IInstantiationService {

        // Layout service
        serviceCollection.set(IWorkbenchLayoutService, this);

        // All Contributed Services
		const contributedServices = getSingletonServiceDescriptors();
		for (let [id, descriptor] of contributedServices) {
			serviceCollection.set(id, descriptor);
		}

        const instantiationService = new InstantiationService(serviceCollection, true);

        // Wrap up
        instantiationService.invokeFunction(accessor => {

            const lifecycleService = accessor.get(ILifecycleService);

            // Signal to lifecycle that services are set
            lifecycleService.phase = LifecyclePhase.Ready;
        });

        return instantiationService;

    }

}