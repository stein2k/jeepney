import { Emitter, Event } from 'jeepney/base/common/event';
import { Orientation } from 'jeepney/base/browser/ui/sash/sash';
import { IView as ISplitView, LayoutPriority, SplitView } from 'jeepney/base/browser/ui/splitview/splitview';
import { IDisposable } from 'jeepney/base/common/lifecycle';

export { LayoutPriority } from 'jeepney/base/browser/ui/splitview/splitview';
export { Orientation } from 'jeepney/base/browser/ui/sash/sash';

export interface IViewSize {
	readonly width: number;
	readonly height: number;
}

export interface IView {
	readonly element: HTMLElement;
	readonly minimumWidth: number;
	readonly maximumWidth: number;
	readonly minimumHeight: number;
	readonly maximumHeight: number;
	readonly onDidChange: Event<IViewSize | undefined>;
	readonly priority?: LayoutPriority;
	readonly snap?: boolean;
	layout(width: number, height: number, orientation: Orientation): void;
	setVisible?(visible: boolean): void;
}

export function orthogonal(orientation: Orientation): Orientation {
	return orientation === Orientation.VERTICAL ? Orientation.HORIZONTAL : Orientation.VERTICAL;
}

export interface ILayoutController {
	readonly isLayoutEnabled: boolean;
}

class BranchNode implements ISplitView, IDisposable {

    readonly element: HTMLElement;
    readonly children: Node[] = [];
    private splitview: SplitView;

    private _size: number;
	get size(): number { return this._size; }

    private _orthogonalSize: number;
	get orthogonalSize(): number { return this._orthogonalSize; }

    get minimumSize(): number {
		return this.children.length === 0 ? 0 : Math.max(...this.children.map(c => c.minimumOrthogonalSize));
	}

	get maximumSize(): number {
		return Math.min(...this.children.map(c => c.maximumOrthogonalSize));
	}

    get minimumOrthogonalSize(): number {
		return this.splitview.minimumSize;
	}

	get maximumOrthogonalSize(): number {
		return this.splitview.maximumSize;
	}

    get minimumWidth(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.minimumOrthogonalSize : this.minimumSize;
	}

	get minimumHeight(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.minimumSize : this.minimumOrthogonalSize;
	}

	get maximumWidth(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.maximumOrthogonalSize : this.maximumSize;
	}

	get maximumHeight(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.maximumSize : this.maximumOrthogonalSize;
    }

    private _onDidChange = new Emitter<number | undefined>();
	readonly onDidChange: Event<number | undefined> = this._onDidChange.event;
    
    constructor(readonly orientation: Orientation) {

    }

    layout(size: number): void {
		this._orthogonalSize = size;

		for (const child of this.children) {
			child.orthogonalLayout(size);
		}
    }
    
    orthogonalLayout(size: number): void {
		this._size = size;
		this.splitview.layout(size);
	}

    dispose(): void {
        for (const child of this.children) {
            child.dispose();
        }

        this.splitview.dispose();

    }

}

class LeafNode implements ISplitView, IDisposable {

    private _size: number = 0;
    get size(): number { return this._size; }

    private _orthogonalSize: number;
    get orthogonalSize(): number { return this._orthogonalSize; }
    
    private _linkedWidthNode: LeafNode | undefined = undefined;
	get linkedWidthNode(): LeafNode | undefined { return this._linkedWidthNode; }
	set linkedWidthNode(node: LeafNode | undefined) {
		this._linkedWidthNode = node;
    }
    
    private _linkedHeightNode: LeafNode | undefined = undefined;
	get linkedHeightNode(): LeafNode | undefined { return this._linkedHeightNode; }
	set linkedHeightNode(node: LeafNode | undefined) {
		this._linkedHeightNode = node;
    }
    
    readonly onDidChange: Event<number | undefined>;
    
    constructor(
        readonly view: IView,
        readonly orientation: Orientation,
        readonly layoutController: ILayoutController,
        orthogonalSize: number
    ) {
        this._orthogonalSize = orthogonalSize;
    }

    get width(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.orthogonalSize : this.size;
	}

	get height(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.size : this.orthogonalSize;
	}

    get element(): HTMLElement {
		return this.view.element;
	}

	private get minimumWidth(): number {
		return this.linkedWidthNode ? Math.max(this.linkedWidthNode.view.minimumWidth, this.view.minimumWidth) : this.view.minimumWidth;
	}

	private get maximumWidth(): number {
		return this.linkedWidthNode ? Math.min(this.linkedWidthNode.view.maximumWidth, this.view.maximumWidth) : this.view.maximumWidth;
	}

	private get minimumHeight(): number {
		return this.linkedHeightNode ? Math.max(this.linkedHeightNode.view.minimumHeight, this.view.minimumHeight) : this.view.minimumHeight;
	}

	private get maximumHeight(): number {
		return this.linkedHeightNode ? Math.min(this.linkedHeightNode.view.maximumHeight, this.view.maximumHeight) : this.view.maximumHeight;
	}

	get minimumSize(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.minimumHeight : this.minimumWidth;
	}

	get maximumSize(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.maximumHeight : this.maximumWidth;
    }

    get minimumOrthogonalSize(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.minimumWidth : this.minimumHeight;
	}

	get maximumOrthogonalSize(): number {
		return this.orientation === Orientation.HORIZONTAL ? this.maximumWidth : this.maximumHeight;
	}
    
    layout(size: number): void {
		this._size = size;

		if (this.layoutController.isLayoutEnabled) {
			this.view.layout(this.width, this.height, orthogonal(this.orientation));
		}
    }
    
    orthogonalLayout(size: number): void {}

    dispose(): void {}

}

type Node = BranchNode | LeafNode;

export class GridView implements IDisposable {

    readonly element: HTMLElement;

    private _root: BranchNode;

    private get root(): BranchNode {
		return this._root;
	}

    get minimumWidth(): number { return this.root.minimumWidth; }
	get minimumHeight(): number { return this.root.minimumHeight; }
	get maximumWidth(): number { return this.root.maximumHeight; }
	get maximumHeight(): number { return this.root.maximumHeight; }

	layout(width: number, height: number): void {
		const [size, orthogonalSize] = this.root.orientation === Orientation.HORIZONTAL ? [height, width] : [width, height];
		this.root.layout(size);
		this.root.orthogonalLayout(orthogonalSize);
	}

    dispose(): void {
	}

}