import { IStorageService, StorageScope } from 'jeepney/platform/storage/common/storage';

export type MementoObject = { [key: string]: any };

export class Memento {

    private static readonly globalMementos = new Map<string, ScopedMemento>();
    private static readonly workspaceMementos = new Map<string, ScopedMemento>();

    private static readonly COMMON_PREFIX = 'memento/';
    
    private readonly id: string;

    constructor(id: string, private storageService: IStorageService) {
		this.id = Memento.COMMON_PREFIX + id;
	}

    getMemento(scope: StorageScope): MementoObject {

		// Scope by Workspace
		if (scope === StorageScope.WORKSPACE) {
			let workspaceMemento = Memento.workspaceMementos.get(this.id);
			if (!workspaceMemento) {
				workspaceMemento = new ScopedMemento(this.id, scope, this.storageService);
				Memento.workspaceMementos.set(this.id, workspaceMemento);
			}

			return workspaceMemento.getMemento();
		}

		// Scope Global
		let globalMemento = Memento.globalMementos.get(this.id);
		if (!globalMemento) {
			globalMemento = new ScopedMemento(this.id, scope, this.storageService);
			Memento.globalMementos.set(this.id, globalMemento);
		}

		return globalMemento.getMemento();
	}

}

class ScopedMemento {
    private readonly mementoObj: MementoObject;
    
    constructor(private id: string, private scope: StorageScope, private storageService: IStorageService) {
        this.mementoObj = this.load();
    }

    getMemento(): MementoObject {
		return this.mementoObj;
	}

    private load(): MementoObject {
        const memento = this.storageService.get(this.id, this.scope);
        if (memento) {
            return JSON.parse(memento);
        }
        return {};
    }

}