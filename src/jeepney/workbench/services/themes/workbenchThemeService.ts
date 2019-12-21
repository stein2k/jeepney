import { createDecorator } from "jeepney/platform/instantiation/common/instantiation";
import { registerSingleton } from "jeepney/platform/instantiation/common/extensions";
import { IThemeService, ITheme } from "jeepney/platform/theme/common/themeService";
import { IWorkbenchLayoutService } from 'jeepney/workbench/services/layoutService';

export const IWorkbenchThemeService = createDecorator<IWorkbenchThemeService>('themeService');

export interface IWorkbenchThemeService extends IThemeService {
    _serviceBrand: any;
}

export interface IColorTheme extends ITheme {
    readonly id: string;
    readonly label: string;
}

export class ColorThemeData implements IColorTheme {

    id: string;
    label: string;

    private constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

}

export class WorkbenchThemeService implements IWorkbenchThemeService {
    _serviceBrand: any;

    private container: HTMLElement;
    private currentColorTheme: ColorThemeData;

    constructor(
        @IWorkbenchLayoutService readonly layoutService: IWorkbenchLayoutService
    ) {
        this.container = layoutService.getWorkbenchContainer();
    }

    public getColorTheme(): IColorTheme {
		return this.currentColorTheme;
	}

    public getTheme(): ITheme {
        return this.getColorTheme();
    }

}

registerSingleton(IWorkbenchThemeService, WorkbenchThemeService);