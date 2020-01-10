import { IThemeService, ITheme } from 'jeepney/platform/theme/common/themeService';
import { Disposable } from "jeepney/base/common/lifecycle";

export class Themable extends Disposable {

    protected theme: ITheme;

    constructor(
        protected themeService: IThemeService
    ) {
        super();

        this.theme = themeService.getTheme();
        
    }

    protected updateStyles(): void {
		// Subclasses to override
	}


}