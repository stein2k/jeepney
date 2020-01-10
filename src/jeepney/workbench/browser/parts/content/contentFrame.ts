import { Event, Relay } from 'jeepney/base/common/event';
import { addClass, $, Dimension } from 'jeepney/base/browser/dom';
import { Part } from 'jeepney/workbench/browser/part';
import { IContentFrameService } from 'jeepney/workbench/services/contentFrame/contentFrameService';
import { registerSingleton } from 'jeepney/platform/instantiation/common/extensions';
import { IWorkbenchLayoutService } from 'jeepney/workbench/services/layoutService';
import { Parts } from 'jeepney/workbench/services/part/common/partService';
import { ServiceIdentifier, IInstantiationService } from 'jeepney/platform/instantiation/common/instantiation';
import { IThemeService } from 'jeepney/platform/theme/common/themeService';
import { CenteredViewLayout } from 'jeepney/base/browser/ui/centered/centeredViewLayout';
import { Grid, ISerializedGrid, IView, SerializableGrid } from 'jeepney/base/browser/ui/grid/grid';
import { IContentFrameCreationOptions, IContentGroupView } from 'jeepney/workbench/browser/parts/content/content';
import { ContentGroupView } from 'jeepney/workbench/browser/parts/content/contentGroupView';
import { MementoObject } from 'jeepney/workbench/common/memento';
import { StorageScope, IStorageService } from 'jeepney/platform/storage/common/storage';
import { ISerializedContentGroup, isSerializedContentGroup } from 'jeepney/workbench/common/content/contentGroup';
import { GroupIdentifier } from 'jeepney/workbench/common/content';
// import { localize } from 'jeepney/nls';
import { MenuViewlet } from 'jeepney/workbench/contrib/menu/menuViewlet';

function localize(env: string, data: string, message: number): string {
    return '';
}

interface IContentFrameUIState {
    serializedGrid: ISerializedGrid;
}

class GridWidgetView<T extends IView> implements IView {

    readonly element: HTMLElement = $('.grid-view-container');

    private _onDidChange = new Relay<{ width: number; height: number; } | undefined>();
    readonly onDidChange: Event<{ width: number; height: number; } | undefined> = this._onDidChange.event;
    
    private _gridWidget: Grid<T>;

	get gridWidget(): Grid<T> {
		return this._gridWidget;
	}

    get minimumWidth(): number { return this.gridWidget ? this.gridWidget.minimumWidth : 0; }
	get maximumWidth(): number { return this.gridWidget ? this.gridWidget.maximumWidth : Number.POSITIVE_INFINITY; }
	get minimumHeight(): number { return this.gridWidget ? this.gridWidget.minimumHeight : 0; }
    get maximumHeight(): number { return this.gridWidget ? this.gridWidget.maximumHeight : Number.POSITIVE_INFINITY; }
    
    layout(width: number, height: number): void {
		if (this.gridWidget) {
			this.gridWidget.layout(width, height);
		}
    }
    
    dispose(): void {
		this._onDidChange.dispose();
	}

}

export class ContentFramePart extends Part implements IContentFrameService {

    _serviceBrand: ServiceIdentifier<any>;

    private static readonly CONTENT_FRAME_UI_STATE_STORAGE_KEY = 'contentframe.state';

    private readonly workspaceMemento: MementoObject;

    private groupViews: Map<GroupIdentifier, IContentGroupView> = new Map<GroupIdentifier, IContentGroupView>();

    private container: HTMLElement;
    private centeredLayoutWidget: CenteredViewLayout;
    private gridWidget: SerializableGrid<IContentGroupView>;
    private gridWidgetView: GridWidgetView<IContentGroupView>;

    private menuViewlet: MenuViewlet;

    constructor(
        @IInstantiationService private readonly instantiationService: IInstantiationService,
        @IThemeService themeService: IThemeService,
        @IStorageService storageService: IStorageService,
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService
    ) {
        super(Parts.CONTENT_PART, {hasTitle: true}, themeService, storageService, layoutService);
        this.gridWidgetView = new GridWidgetView<IContentGroupView>();
        
        this.workspaceMemento = this.getMemento(StorageScope.WORKSPACE);

        this.menuViewlet = this._register(this.instantiationService.createInstance(MenuViewlet));

    }

    get count(): number {
		return this.groupViews.size;
	}

    private doCreateGroupView(from?: IContentGroupView | ISerializedContentGroup | null): IContentGroupView {

        // Label: just use the number of existing groups as label
		const label = this.getGroupLabel(this.count + 1);

        // Create group view
        let groupView: IContentGroupView;
        if (from instanceof ContentGroupView) {

        } else if (isSerializedContentGroup(from)) {

        } else {
            groupView = ContentGroupView.createNew(this, label, this.instantiationService);
        }

        return groupView;

    }
    
    create(parent: HTMLElement): void {
        super.create(parent);
    }

    createContentArea(parent: HTMLElement, options?: IContentFrameCreationOptions): HTMLElement {

        // Container
        this.element = parent;
        this.container = document.createElement('div');
        addClass(this.container, 'content');
        parent.appendChild(this.container);

        // Viewlets menu
        this.menuViewlet.create(this.container);

        // Grid control with center layout
		this.doCreateGridControl(options);

        this.centeredLayoutWidget = this._register(new CenteredViewLayout(this.container, this.gridWidgetView))

        return this.container;

    }

    layout(dimension: Dimension): Dimension[];
    layout(width: number, height: number): void;
    layout(dim1: Dimension | number, dim2?: number): Dimension[] | void {
        
        // Pass to super
        const sizes = super.layout(dim1 instanceof Dimension ? dim1 : new Dimension(dim1, dim2));

        // Adjust size of menuViewlet
        this.menuViewlet.layout(dim1 instanceof Dimension ? dim1 : new Dimension(dim1, dim2));

    }

    private doCreateGridControl(options?: IContentFrameCreationOptions): void {

        // Grid Widget (with previous UI state)
        let restoreError = false;
        if (!options || options.restorePreviousState) {
            restoreError = !this.doCreateGridControlWithPreviousState();
        }

        // Grid Widget (no previous UI state or failed to restore)
        if (!this.gridWidget || restoreError) {
            const initialGroup = this.doCreateGroupView();
        }

    }

    private doCreateGridControlWithPreviousState(): boolean {
        const uiState: IContentFrameUIState = this.workspaceMemento[ContentFramePart.CONTENT_FRAME_UI_STATE_STORAGE_KEY];
        if (uiState && uiState.serializedGrid) {
            try {
            } catch (error) {
                return false;   // failure
            }
        }
        return true;            // success

    }

    private getGroupLabel(index: number): string {
		return localize('groupLabel', "Group {0}", index);
	}

}

registerSingleton(IContentFrameService, ContentFramePart);