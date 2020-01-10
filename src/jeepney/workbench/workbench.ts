import 'jeepney/workbench/browser/style';

import { Disposable } from "jeepney/base/common/lifecycle";
import { ServiceCollection } from "jeepney/platform/instantiation/common/serviceCollection";
import { IInstantiationService } from "jeepney/platform/instantiation/common/instantiation";
import { InstantiationService } from "jeepney/platform/instantiation/common/instantiationService";
import { ILifecycleService, LifecyclePhase } from "jeepney/platform/lifecycle/lifecycle";
import { getSingletonServiceDescriptors } from 'jeepney/platform/instantiation/common/extensions';
import { IWorkbenchLayoutService } from "jeepney/workbench/services/layoutService";
import { Layout } from 'jeepney/workbench/browser/layout';
import { Parts } from 'jeepney/workbench/services/part/common/partService';
import { addClass, addClasses } from "jeepney/base/browser/dom";
import { IStorageService } from "jeepney/platform/storage/common/storage";
import { IPartService } from './services/part/common/partService';

export class Workbench extends Layout {

    private instantiationService: IInstantiationService;
    private lifecycleService: ILifecycleService;

    private workspaceHidden: boolean;

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

            // Services
            const storageService = accessor.get(IStorageService);

            // Initialize Workbench Layout
            this.initLayout(accessor);

            // Settings
            this.initSettings();

            // Render Workbench
            this.renderWorkbench(instantiationService);

            // Create Workbench Layout
            this.createWorkbenchLayout(instantiationService);

            // Layout
            this.layout();

        });

        return instantiationService;

    }

    private initServices(serviceCollection : ServiceCollection) : IInstantiationService {

        // Services we contribute
        serviceCollection.set(IPartService, this);

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

    private initSettings(): void {

        // Workspace visibility
        this.workspaceHidden = false;

    }

    private renderWorkbench(instantiationService: IInstantiationService): void {

        // Create Parts
		[
            { id: Parts.CONTENT_PART, role: 'main', classes: ['contentMain'], options: { restorePreviousState: this.state.workspace.restoreWorkspace } }
		].forEach(({ id, role, classes, options }) => {
            const partContainer = this.createPart(id, role, classes);
            this.container.insertBefore(partContainer, this.container.lastChild);
			this.getPart(id).create(partContainer, options);
        });
        
        // Add Workbench to DOM
		this.parent.appendChild(this.container);

    }

    private createPart(id: string, role: string, classes: string[]): HTMLElement {
        const part = document.createElement('div');
        addClasses(part, 'part', ...classes);
        part.id = id;
        part.setAttribute('role', role);
        return part;
    }

    isVisible(part: Parts): boolean {
        switch (part) {
            case Parts.CONTENT_PART:
                return !this.workspaceHidden;
        }
        return true;
    }

}