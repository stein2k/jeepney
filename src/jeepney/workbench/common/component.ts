import { IThemeService } from 'jeepney/platform/theme/common/themeService';
import { Themable } from 'jeepney/workbench/common/theme';

export class Component extends Themable {

    constructor(
        private readonly id: string,
        themeService: IThemeService
    ) {
        super(themeService);
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

}