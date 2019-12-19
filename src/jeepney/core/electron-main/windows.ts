import { Disposable } from "jeepney/base/common/lifecycle";
import { IWindowsMainService } from "jeepney/platform/windows/common/windows";
import { ILifecycleService, LifecyclePhase } from "jeepney/platform/lifecycle/lifecycle";

export class WindowsManager extends Disposable implements IWindowsMainService {

    _serviceBrand : any;

    constructor (
        @ILifecycleService private readonly lifecycleService: ILifecycleService
    ) { 
        super(); 

        this.lifecycleService.when(LifecyclePhase.Ready).then(() => this.registerListeners());
    
    }

    private registerListeners() : void {
        
    }

}