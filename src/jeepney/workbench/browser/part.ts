import { Dimension, size } from 'jeepney/base/browser/dom';
import { IDimension, IWorkbenchLayoutService } from 'jeepney/workbench/services/layoutService';
import { Component } from 'jeepney/workbench/common/component';
import { IThemeService } from 'jeepney/platform/theme/common/themeService';
import { IStorageService } from 'jeepney/platform/storage/common/storage';

export interface IPartOptions {
	hasTitle?: boolean;
	borderWidth?: () => number;
}

export interface ILayoutContentResult {
	titleSize: IDimension;
	contentSize: IDimension;
}

export abstract class Part extends Component {

    private parent: HTMLElement;
	private titleArea: HTMLElement | null;
	private contentArea: HTMLElement | null;
	private partLayout: PartLayout;

    constructor(
        id: string,
        private options: IPartOptions,
		themeService: IThemeService,
		storageService: IStorageService,
        layoutService: IWorkbenchLayoutService

    ) {
        super(id, themeService, storageService);
        layoutService.registerPart(this);
    }

    updateStyles(): void {
		super.updateStyles();
	}

    /**
	 * Note: Clients should not call this method, the workbench calls this
	 * method. Calling it otherwise may result in unexpected behavior.
	 *
	 * Called to create title and content area of the part.
	 */
	create(parent: HTMLElement, options?: object): void {
		this.parent = parent;
		this.titleArea = this.createTitleArea(parent, options);
		this.contentArea = this.createContentArea(parent, options);

		this.partLayout = new PartLayout(this.options, this.contentArea);

		this.updateStyles();
	}
	
	/**
	 * Returns the overall part container.
	 */
	getContainer(): HTMLElement {
		return this.parent;
	}
    
    /**
	 * Subclasses override to provide a title area implementation.
	 */
	protected createTitleArea(parent: HTMLElement, options?: object): HTMLElement | null {
		return null;
	}

    /**
	 * Returns the title area container.
	 */
	protected getTitleArea(): HTMLElement | null {
		return this.titleArea;
	}

	/**
	 * Subclasses override to provide a content area implementation.
	 */
	protected createContentArea(parent: HTMLElement, options?: object): HTMLElement | null {
		return null;
	}

	/**
	 * Returns the content area container.
	 */
	protected getContentArea(): HTMLElement | null {
		return this.contentArea;
	}

	element: HTMLElement;
	
	/**
	 * Layout title and content area in the given dimension.
	 */
	layout(dimension: Dimension): Dimension[] {
		return this.partLayout.layout(dimension);
	}

}

class PartLayout {

	private static readonly TITLE_HEIGHT = 35;

	constructor(private options: IPartOptions, private contentArea: HTMLElement | null) { }

	layout(dimension: Dimension): Dimension[] {
		const { width, height } = dimension;

		// Return the applied sizes to title and content
		const sizes: Dimension[] = [];

		return sizes;
	}

	// layout(width: number, height: number): ILayoutContentResult {

	// 	// Title Size: Width (Fill), Height (Variable)
	// 	let titleSize: Dimension;
	// 	if (this.options && this.options.hasTitle) {
	// 		titleSize = new Dimension(width, Math.min(height, PartLayout.TITLE_HEIGHT));
	// 	} else {
	// 		titleSize = new Dimension(0, 0);
	// 	}

	// 	// Content Size: Width (Fill), Height (Variable)
	// 	const contentSize = new Dimension(width, height - titleSize.height);

	// 	if (this.options && typeof this.options.borderWidth === 'function') {
	// 		contentSize.width -= this.options.borderWidth(); // adjust for border size
	// 	}

	// 	// Content
	// 	if (this.contentArea) {
	// 		size(this.contentArea, contentSize.width, contentSize.height);
	// 	}

	// 	return { titleSize, contentSize };
	// }
}