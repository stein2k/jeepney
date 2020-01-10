import { IThemeService } from 'jeepney/platform/theme/common/themeService';
import { Themable } from 'jeepney/workbench/common/theme';
import { Memento, MementoObject } from 'jeepney/workbench/common/memento';
import { IStorageService, StorageScope } from 'jeepney/platform/storage/common/storage';

export class Component extends Themable {
    private readonly memento: Memento;

    constructor(
        private readonly id: string,
        themeService: IThemeService,
        storageService: IStorageService
    ) {
        super(themeService);
        this.id = id;
        this.memento = new Memento(this.id, storageService);
    }

    getId(): string {
        return this.id;
    }

    protected getMemento(scope: StorageScope): MementoObject {
        return this.memento.getMemento(scope);
    }

}