import { createDecorator } from "jeepney/platform/instantiation/common/instantiation";

export const IThemeService = createDecorator<IThemeService>('themeService');

export interface ITheme {
}

export interface IThemeService {
    _serviceBrand: any;
    getTheme(): ITheme;
}