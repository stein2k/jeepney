import { Disposable } from "jeepney/base/common/lifecycle";
import { ServiceCollection } from "jeepney/platform/instantiation/common/serviceCollection";
import { IInstantiationService } from "jeepney/platform/instantiation/common/instantiation";
import { InstantiationService } from "jeepney/platform/instantiation/common/instantiationService";
import { ILifecycleService, LifecyclePhase } from "jeepney/platform/lifecycle/lifecycle";
import { getSingletonServiceDescriptors } from 'jeepney/platform/instantiation/common/extensions';

export class Workbench extends Disposable {

    private lifecycleService: ILifecycleService;

    constructor (
        private readonly serviceCollection : ServiceCollection
    ) {
        super();
    }

    startup() : IInstantiationService {

        // Services
        const instantiationService = this.initServices(this.serviceCollection);

        return instantiationService;

    }

    private initServices(serviceCollection : ServiceCollection) : IInstantiationService {

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