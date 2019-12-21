import { IWorkbenchLayoutService } from 'jeepney/workbench/services/layoutService';
import { Component } from 'jeepney/workbench/common/component';
import { IThemeService } from 'jeepney/platform/theme/common/themeService';

export abstract class Part extends Component {

    constructor(
        id: string,
        themeService: IThemeService,
        layoutService: IWorkbenchLayoutService

    ) {
        super(id, themeService);
        layoutService.registerPart(this);
    }

}