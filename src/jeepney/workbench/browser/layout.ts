import { Disposable } from "jeepney/base/common/lifecycle";
import { ServiceIdentifier, IInstantiationService, ServicesAccessor } from 'jeepney/platform//instantiation/common/instantiation';
import { IWorkbenchLayoutService, Parts } from 'jeepney/workbench/services/layoutService';
import { Part } from 'jeepney/workbench/browser/part';
import { IContentFrameService } from "../services/contentFrame/contentFrameService";

export class WorkbenchLayout extends Disposable {

}

export abstract class Layout extends Disposable implements IWorkbenchLayoutService {

    _serviceBrand: ServiceIdentifier<any>;

    private _container: HTMLElement = document.createElement('div');
    get container(): HTMLElement { return this._container; }

    private parts: Map<string, Part> = new Map<string, Part>();
    
    private workbenchGrid: WorkbenchLayout;

    private contentFrameService: IContentFrameService;

    constructor(
        protected readonly parent: HTMLElement
    ) {
        super();
    }

    protected initLayout(accessor: ServicesAccessor): void {

        // Services
        
        // Parts
        this.contentFrameService = accessor.get(IContentFrameService);

    }

    getWorkbenchContainer(): HTMLElement {
        return this.parent;
    }

    registerPart(part: Part): void {
		this.parts.set(part.getId(), part);
    }

    protected getPart(key: Parts): Part {
        const part = this.parts.get(key);
        if (!part) {
			throw new Error(`Unknown part ${key}`);
		}

		return part;
    }

    protected createWorkbenchLayout(instantiationService: IInstantiationService): void {
        const contentPart = this.getPart(Parts.CONTENT_PART);
        this.workbenchGrid = instantiationService.createInstance(
            WorkbenchLayout,
            this.parent,
            this.container,
            {
                content: contentPart
            }
        );
    }

}