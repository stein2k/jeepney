import { IInstantiationService } from 'jeepney/platform/instantiation/common/instantiation';
import { Event, Relay } from 'jeepney/base/common/event';
import { Dimension } from 'jeepney/base/browser/dom';
import { ContentGroup, ISerializedContentGroup } from 'jeepney/workbench/common/content/contentGroup';
import { Themable } from 'jeepney/workbench/common/theme';
import { IThemeService } from 'jeepney/platform/theme/common/themeService';
import { IContentGroupsAccessor, IContentGroupView } from 'jeepney/workbench/browser/parts/content/content';
import { ContentControl } from 'jeepney/workbench/browser/parts/content/contentControl';
import { TitleControl } from 'jeepney/workbench/browser/parts/content/titleControl';

export class ContentGroupView extends Themable implements IContentGroupView {

    //#region factory

	static createNew(accessor: IContentGroupsAccessor, label: string, instantiationService: IInstantiationService): IContentGroupView {
		return instantiationService.createInstance(ContentGroupView, accessor, null, label);
	}

	static createFromSerialized(serialized: ISerializedContentGroup, accessor: IContentGroupsAccessor, label: string, instantiationService: IInstantiationService): IContentGroupView {
		return instantiationService.createInstance(ContentGroupView, accessor, serialized, label);
	}

	static createCopy(copyFrom: IContentGroupView, accessor: IContentGroupsAccessor, label: string, instantiationService: IInstantiationService): IContentGroupView {
		return instantiationService.createInstance(ContentGroupView, accessor, copyFrom, label);
    }

    private _group: ContentGroup;

    private dimension: Dimension;

    private titleContainer: HTMLElement;
	private titleAreaControl: TitleControl;

    private contentContainer: HTMLElement;
    private contentControl: ContentControl;
    
    constructor(
        private accessor: IContentGroupsAccessor,
        from: IContentGroupView | ISerializedContentGroup,
        private _label: string,
        @IThemeService themeService: IThemeService
    ) {
        super(themeService);
    }

    readonly element: HTMLElement = document.createElement('div');

	get minimumWidth(): number { return this.contentControl.minimumWidth; }
	get minimumHeight(): number { return this.contentControl.minimumHeight; }
	get maximumWidth(): number { return this.contentControl.maximumWidth; }
    get maximumHeight(): number { return this.contentControl.maximumHeight; }
    
    private _onDidChange = this._register(new Relay<{ width: number; height: number; } | undefined>());
    readonly onDidChange: Event<{ width: number; height: number; } | undefined> = this._onDidChange.event;
    
    layout(width: number, height: number): void {
		this.dimension = new Dimension(width, height);

		// Ensure editor container gets height as CSS depending
		// on the preferred height of the title control
		this.contentContainer.style.height = `calc(100% - ${this.titleAreaControl.getPreferredHeight()}px)`;

		// Forward to controls
		this.titleAreaControl.layout(new Dimension(this.dimension.width, this.titleAreaControl.getPreferredHeight()));
		this.contentControl.layout(new Dimension(this.dimension.width, this.dimension.height - this.titleAreaControl.getPreferredHeight()));
	}

    toJSON(): ISerializedContentGroup {
		return this._group.serialize();
	}

}