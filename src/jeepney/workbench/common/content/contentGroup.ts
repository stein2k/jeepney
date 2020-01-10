import { Disposable } from 'jeepney/base/common/lifecycle';
import { Registry } from 'jeepney/platform/registry/common/platform';
import { ContentFrame, Extensions, GroupIdentifier, IContentFrameFactoryRegistry, IContentFrame } from 'jeepney/workbench/common/content';

export interface ISerializedContentFrame {
    id: string;
    value: string;
}

export interface ISerializedContentGroup {
    id: number;
    content: ISerializedContentFrame[];
    mru: number[];
    preview?: number;
}

export function isSerializedContentGroup(obj?: any): obj is ISerializedContentGroup {
	const group: ISerializedContentGroup = obj;

	return obj && typeof obj === 'object' && Array.isArray(group.content) && Array.isArray(group.mru);
}

export class ContentGroup extends Disposable {

    private _id: GroupIdentifier;

    private content: ContentFrame[] = [];
    private mru: ContentFrame[] = [];

    private preview: ContentFrame | null; // editor in preview state

    get id(): GroupIdentifier {
		return this._id;
    }
    
    private matches(editorA: IContentFrame | null, editorB: IContentFrame | null): boolean {
		return !!editorA && !!editorB && editorA.matches(editorB);
	}

    serialize(): ISerializedContentGroup {
		const registry = Registry.as<IContentFrameFactoryRegistry>(Extensions.ContentFrameFactories);

		// Serialize all editor inputs so that we can store them.
		// Editors that cannot be serialized need to be ignored
		// from mru, active and preview if any.
		let serializableFrames: ContentFrame[] = [];
		let serializedContent: ISerializedContentFrame[] = [];
		let serializablePreviewIndex: number | undefined;
		this.content.forEach(e => {
			const factory = registry.getContentFrameFactory(e.getTypeId());
			if (factory) {
				const value = factory.serialize(e);
				if (typeof value === 'string') {
					serializedContent.push({ id: e.getTypeId(), value });
					serializableFrames.push(e);

					if (this.preview === e) {
						serializablePreviewIndex = serializableFrames.length - 1;
					}
				}
			}
		});

		const serializableMru = this.mru.map(e => this.indexOf(e, serializableFrames)).filter(i => i >= 0);

		return {
			id: this.id,
			content: serializedContent,
			mru: serializableMru,
			preview: serializablePreviewIndex,
		};
    }
    
    indexOf(candidate: IContentFrame | null, content = this.content): number {
		if (!candidate) {
			return -1;
		}

		for (let i = 0; i < content.length; i++) {
			if (this.matches(content[i], candidate)) {
				return i;
			}
		}

		return -1;
	}

}