import { Part } from 'jeepney/workbench/browser/part';
import { IContentFrameService } from 'jeepney/workbench/services/contentFrame/contentFrameService';
import { registerSingleton } from 'jeepney/platform/instantiation/common/extensions';
import { IWorkbenchLayoutService, Parts } from 'jeepney/workbench/services/layoutService';
import { ServiceIdentifier } from 'jeepney/platform/instantiation/common/instantiation';
import { IThemeService } from 'jeepney/platform/theme/common/themeService';

export class ContentFramePart extends Part implements IContentFrameService {

    _serviceBrand: ServiceIdentifier<any>;

    constructor(
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
        @IThemeService themeService: IThemeService
    ) {
        super(Parts.CONTENT_PART, themeService, layoutService);
    }

}

registerSingleton(IContentFrameService, ContentFramePart);