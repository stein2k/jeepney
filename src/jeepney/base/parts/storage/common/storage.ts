import { IDisposable, Disposable } from 'jeepney/base/common/lifecycle';
import { isUndefinedOrNull } from 'jeepney/base/common/types';
import { basename } from 'jeepney/base/common/path';

export enum StorageHint {

	// A hint to the storage that the storage
	// does not exist on disk yet. This allows
	// the storage library to improve startup
	// time by not checking the storage for data.
	STORAGE_DOES_NOT_EXIST
}

export interface IStorageOptions {
	hint?: StorageHint;
}

export interface IStorageDatabase {
}

export interface IStorage extends IDisposable {

	init(): Promise<void>;

    get(key: string, fallbackValue: string): string;
    get(key: string, fallbackValue?: string): string | undefined;
    
}

export class Storage extends Disposable implements IStorage {

    private cache: Map<string, string> = new Map<string, string>();

    constructor(
		protected database: IStorageDatabase,
		private options: IStorageOptions = Object.create(null)
	) {
		super();
	}

	async init(): Promise<void> {
		return Promise.all([]).then();
	}
    
    get(key: string, fallbackValue: string): string;
	get(key: string, fallbackValue?: string): string | undefined;
	get(key: string, fallbackValue?: string): string | undefined {
		const value = this.cache.get(key);

		if (isUndefinedOrNull(value)) {
			return fallbackValue;
		}

		return value;
	}

}

export class SQLiteStorageDatabase implements IStorageDatabase {

	private path: string;
	private name: string;
	
	constructor(path: string) {
		this.path = path;
		this.name = basename(path);
	}

}