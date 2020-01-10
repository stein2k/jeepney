import { Disposable } from "jeepney/base/common/lifecycle";
import { Dimension } from 'jeepney/base/browser/dom';
import { DEFAULT_CONTENT_MAX_DIMENSIONS, DEFAULT_CONTENT_MIN_DIMENSIONS } from 'jeepney/workbench/browser/parts/content/content';
import { BaseContentWorkspace } from 'jeepney/workbench/browser/parts/content/baseContentWorkspace';

export class ContentControl extends Disposable {

    private dimension: Dimension;

    get minimumWidth() { return this._activeControl ? this._activeControl.minimumWidth : DEFAULT_CONTENT_MIN_DIMENSIONS.width; }
	get minimumHeight() { return this._activeControl ? this._activeControl.minimumHeight : DEFAULT_CONTENT_MIN_DIMENSIONS.height; }
	get maximumWidth() { return this._activeControl ? this._activeControl.maximumWidth : DEFAULT_CONTENT_MAX_DIMENSIONS.width; }
    get maximumHeight() { return this._activeControl ? this._activeControl.maximumHeight : DEFAULT_CONTENT_MAX_DIMENSIONS.height; }
    
    private _activeControl: BaseContentWorkspace | null;

    layout(dimension: Dimension): void {
		this.dimension = dimension;

		if (this._activeControl && this.dimension) {
			this._activeControl.layout(this.dimension);
		}
	}

}