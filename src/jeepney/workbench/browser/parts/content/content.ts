import { IDisposable } from "jeepney/base/common/lifecycle";
import { Dimension } from 'jeepney/base/browser/dom';
import { ISerializableView } from "jeepney/base/browser/ui/grid/grid";

export const CONTENT_TITLE_HEIGHT = 35;

export const DEFAULT_CONTENT_MIN_DIMENSIONS = new Dimension(220, 70);
export const DEFAULT_CONTENT_MAX_DIMENSIONS = new Dimension(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

export interface IContentFrameCreationOptions {
    restorePreviousState: boolean;
}

export interface IContentGroupView extends IDisposable, ISerializableView {

}

export interface IContentGroupsAccessor {
    
}