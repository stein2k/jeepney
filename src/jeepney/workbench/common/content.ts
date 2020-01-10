import { Disposable, IDisposable } from "jeepney/base/common/lifecycle";

export interface IContentWorkspace {

    /**
	 * The minimum width of this editor.
	 */
	readonly minimumWidth: number;

	/**
	 * The maximum width of this editor.
	 */
	readonly maximumWidth: number;

	/**
	 * The minimum height of this editor.
	 */
	readonly minimumHeight: number;

	/**
	 * The maximum height of this editor.
	 */
	readonly maximumHeight: number;

}

export interface IContentFrameFactoryRegistry {

    /**
	 * Returns the editor input factory for the given editor input.
	 *
	 * @param editorInputId the identifier of the editor input
	 */
	getContentFrameFactory(editorInputId: string): IContentFrameFactory | undefined;

}

export interface IContentFrameFactory {

    /**
	 * Returns a string representation of the provided editor input that contains enough information
	 * to deserialize back to the original editor input from the deserialize() method.
	 */
	serialize(editorInput: ContentFrame): string | undefined;

}

export interface IContentFrame extends IDisposable {

    /**
	 * Returns if the other object matches this input.
	 */
	matches(other: unknown): boolean;

}

export abstract class ContentFrame extends Disposable implements IContentFrame {

    /**
	 * Returns the unique type identifier of this input.
	 */
    abstract getTypeId(): string;
    
    /**
	 * Returns true if this input is identical to the otherInput.
	 */
	matches(otherInput: unknown): boolean {
		return this === otherInput;
	}

}

export type GroupIdentifier = number;

export const Extensions = {
    ContentFrameFactories: 'workbench.contributions.content.frameFactories'
};