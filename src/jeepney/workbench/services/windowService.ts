import { Disposable } from "jeepney/base/common/lifecycle";
import { IWindowService } from "jeepney/platform/windows/common/windows";
import { registerSingleton } from "jeepney/platform/instantiation/common/extensions";

export class WindowService extends Disposable implements IWindowService {

    _serviceBrand : any;

    private _windowId: number;

    constructor(

    ) {
        super();
    }

    get windowId() : number {
        return this._windowId;
    }

}

registerSingleton(IWindowService, WindowService);