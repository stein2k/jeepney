import { isMacintosh, isWeb } from 'jeepney/base/common/platform';
import { getClientArea, position, size, Dimension } from 'jeepney/base/browser/dom';
import { Disposable } from "jeepney/base/common/lifecycle";
import { ServiceIdentifier, IInstantiationService, ServicesAccessor } from 'jeepney/platform/instantiation/common/instantiation';
import { IDimension, ILayoutOptions, IWorkbenchLayoutService } from 'jeepney/workbench/services/layoutService';
import { Part } from 'jeepney/workbench/browser/part';
import { IContentFrameService } from "../services/contentFrame/contentFrameService";
import { Grid } from 'jeepney/base/browser/ui/grid/grid';
import { getTitleBarStyle, MenuBarVisibility } from 'jeepney/platform/windows/common/windows' ;
import { IWorkbenchEnvironmentService } from 'jeepney/workbench/services/environment/common/environmentService';
import { IConfigurationService } from 'jeepney/platform/configuration/common/configuration';
import { memoize } from 'jeepney/base/common/decorators';
import { getZoomFactor } from 'jeepney/base/browser/browser';
import { ContentFramePart } from './parts/content/contentFrame';
import { IPartService, Parts } from 'jeepney/workbench/services/part/common/partService';

const TITLE_BAR_HEIGHT = isMacintosh && !isWeb ? 22 : 30;
const STATUS_BAR_HEIGHT = 22;
const ACTIVITY_BAR_WIDTH = 48;

const MIN_SIDEBAR_PART_WIDTH = 170;

const MIN_PANEL_PART_HEIGHT = 77;
const MIN_PANEL_PART_WIDTH = 300;

export class WorkbenchLayout extends Disposable {

    private workbenchSize: Dimension;

    private titlebarHeight: number;
	private statusbarHeight: number;

    constructor(
        private parent: HTMLElement,
        private workbenchContainer: HTMLElement,
        private parts: {
            workspace: ContentFramePart
        },
        @IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
        @IPartService private readonly partService: IPartService
    ) {
        super();
    }

    @memoize
	public get partLayoutInfo() {
		return {
			titlebar: {
				height: TITLE_BAR_HEIGHT
			},
			activitybar: {
				width: ACTIVITY_BAR_WIDTH
			},
			sidebar: {
				minWidth: MIN_SIDEBAR_PART_WIDTH
			},
			panel: {
				minHeight: MIN_PANEL_PART_HEIGHT,
				minWidth: MIN_PANEL_PART_WIDTH
			},
			statusbar: {
				height: STATUS_BAR_HEIGHT
			}
		};
    }
    
    private get workspaceWidth(): number {
		if (this.partService.isVisible(Parts.ACTIVITYBAR_PART)) {
			return this.partLayoutInfo.activitybar.width;
		}

		return 0;
	}

    layout(options?: ILayoutOptions): void {
        this.workbenchSize = getClientArea(this.parent);

        const isTitleBarHidden = !this.layoutService.isVisible(Parts.TITLEBAR_PART);
        const isStatusbarHidden = !this.layoutService.isVisible(Parts.STATUSBAR_PART);
        const menubarVisibility = this.layoutService.getMenubarVisibility();

        this.statusbarHeight = isStatusbarHidden ? 0 : this.partLayoutInfo.statusbar.height;
		this.titlebarHeight = isTitleBarHidden ? 0 : this.partLayoutInfo.titlebar.height / (isMacintosh || !menubarVisibility || menubarVisibility === 'hidden' ? getZoomFactor() : 1); // adjust for zoom prevention

        // Workspace
        let workspaceSize = {
            width: 0,
            height: 0
        };

        workspaceSize.width = this.workbenchSize.width;
        workspaceSize.height = this.workbenchSize.height - this.titlebarHeight;

        // Workbench
        position(this.workbenchContainer, 0, 0, 0, 0, 'relative');
        size(this.workbenchContainer, this.workbenchSize.width, this.workbenchSize.height);

        // Workspace Part
        const workspaceContainer = this.parts.workspace.getContainer();
        this.parts.workspace.getContainer().style.right = '';
        position(workspaceContainer, this.titlebarHeight, 0, 0, null);
        size(workspaceContainer, workspaceSize.width, workspaceSize.height);

        // Propagate to Parts Layouts
        this.parts.workspace.layout(new Dimension(workspaceSize.width, workspaceSize.height));

    }

}

export abstract class Layout extends Disposable implements IWorkbenchLayoutService {

    _serviceBrand: ServiceIdentifier<any>;

    private _dimension: IDimension;
	get dimension(): IDimension { return this._dimension; }

    private _container: HTMLElement = document.createElement('div');
    get container(): HTMLElement { return this._container; }

    private parts: Map<string, Part> = new Map<string, Part>();
    
    private workbenchGrid: WorkbenchLayout;

    private disposed: boolean;

    private environmentService: IWorkbenchEnvironmentService;
    private configurationService: IConfigurationService;
    private contentFrameService: IContentFrameService;

    protected readonly state = {
        fullscreen: false,

        menuBar: {
            visibility: 'default' as MenuBarVisibility,
            toggled: false
        },

        workspace: {
            restoreWorkspace: false
        }
    };

    constructor(
        protected readonly parent: HTMLElement
    ) {
        super();
    }

    protected initLayout(accessor: ServicesAccessor): void {

        // Services
		this.environmentService = accessor.get(IWorkbenchEnvironmentService);
		this.configurationService = accessor.get(IConfigurationService);
        
        // Parts
        this.contentFrameService = accessor.get(IContentFrameService);

    }

    getMenubarVisibility(): MenuBarVisibility {
		return this.state.menuBar.visibility;
	}

    getWorkbenchContainer(): HTMLElement {
        return this.parent;
    }

    layout(options?: ILayoutOptions): void {
        if (!this.disposed) {
            this._dimension = getClientArea(this.parent);
            this.workbenchGrid.layout(options);
        }
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
                workspace: contentPart
            }
        );
    }

    isVisible(part: Parts): boolean {
        switch (part) {
            case Parts.TITLEBAR_PART:
                if (getTitleBarStyle(this.configurationService, this.environmentService) === 'native') {
                    return false;
                } else if (!this.state.fullscreen) {
                    return true;
                }
                return false;
        }
    }

}