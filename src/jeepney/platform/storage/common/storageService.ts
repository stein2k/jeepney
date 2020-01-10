import { Disposable } from 'jeepney/base/common/lifecycle';
import { IStorageService, StorageScope } from 'jeepney/platform/storage/common/storage';
import { ServiceIdentifier } from 'jeepney/platform/instantiation/common/instantiation';
import { IStorage, IStorageDatabase, SQLiteStorageDatabase, Storage } from 'jeepney/base/parts/storage/common/storage';
import { IWorkspaceInitializationPayload } from 'jeepney/platform/workspaces/common/workspaces';

export class StorageService extends Disposable implements IStorageService {

    _serviceBrand: ServiceIdentifier<any>;

    private globalStorage: IStorage;
    private workspaceStorage: IStorage;

    private initializePromise: Promise<void>;

    constructor(
        globalStorageDatabase: IStorageDatabase
    ) {
        super();

        // Global Storage
        this.globalStorage = new Storage(globalStorageDatabase);

    }

    initialize(payload: IWorkspaceInitializationPayload): Promise<void> {
        if (!this.initializePromise) {
            this.initializePromise = this.doInitialize(payload);
        }
        return this.initializePromise;
    }

    private async doInitialize(payload: IWorkspaceInitializationPayload): Promise<void> {
        await Promise.all([
            this.initializeWorkspaceStorage(payload)
        ]);
    }

    private async initializeWorkspaceStorage(payload: IWorkspaceInitializationPayload): Promise<void> {

        // Prepare workspace storage folder for DB
        try {
            await this.createWorkspaceStorage('foo').init();
        } catch (error) {
            return this.createWorkspaceStorage('bar').init();
        }

    }

    private createWorkspaceStorage(workspaceStoragePath: string): IStorage {
        this.workspaceStorage = new Storage(new SQLiteStorageDatabase(workspaceStoragePath));
        return this.workspaceStorage;
    }

    get(key: string, scope: StorageScope, fallbackValue: string): string;
	get(key: string, scope: StorageScope): string | undefined;
	get(key: string, scope: StorageScope, fallbackValue?: string): string | undefined {
		return this.getStorage(scope).get(key, fallbackValue);
    }
    
    private getStorage(scope: StorageScope): IStorage {
		return scope === StorageScope.GLOBAL ? this.globalStorage : this.workspaceStorage;
	}

}