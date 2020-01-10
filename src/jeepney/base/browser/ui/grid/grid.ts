import { Disposable } from 'jeepney/base/common/lifecycle';
import { IView as IGridViewView, GridView, Orientation } from './gridview';

export interface IView extends IGridViewView {
	readonly preferredHeight?: number;
	readonly preferredWidth?: number;
}

export class Grid<T extends IView = IView> extends Disposable {

	protected gridview: GridView;

	get minimumWidth(): number { return this.gridview.minimumWidth; }
	get minimumHeight(): number { return this.gridview.minimumHeight; }
	get maximumWidth(): number { return this.gridview.maximumWidth; }
	get maximumHeight(): number { return this.gridview.maximumHeight; }

	private didLayout = false;

	layout(width: number, height: number): void {
		this.gridview.layout(width, height);
		this.didLayout = true;
	}

}

export interface ISerializableView extends IView {
	toJSON(): object;
}

export interface ISerializedLeafNode {
	type: 'leaf';
	data: object | null;
	size: number;
	visible?: boolean;
}

export interface ISerializedBranchNode {
	type: 'branch';
	data: ISerializedNode[];
	size: number;
}

export type ISerializedNode = ISerializedLeafNode | ISerializedBranchNode;

export interface ISerializedGrid {
	root: ISerializedNode;
	orientation: Orientation;
	width: number;
	height: number;
}

export class SerializableGrid<T extends ISerializableView> extends Grid<T> {
	
}