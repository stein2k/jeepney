import { Panel } from 'jeepney/workbench/browser/panel';
import { IContentWorkspace } from "jeepney/workbench/common/content";
import { DEFAULT_CONTENT_MAX_DIMENSIONS, DEFAULT_CONTENT_MIN_DIMENSIONS } from 'jeepney/workbench/browser/parts/content/content';

export abstract class BaseContentWorkspace extends Panel implements IContentWorkspace {

    readonly minimumWidth = DEFAULT_CONTENT_MIN_DIMENSIONS.width;
	readonly maximumWidth = DEFAULT_CONTENT_MAX_DIMENSIONS.width;
	readonly minimumHeight = DEFAULT_CONTENT_MIN_DIMENSIONS.height;
	readonly maximumHeight = DEFAULT_CONTENT_MAX_DIMENSIONS.height;

}