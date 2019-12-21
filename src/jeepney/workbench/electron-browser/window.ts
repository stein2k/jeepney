import { ipcRenderer as ipc } from 'electron';
import { Disposable } from 'jeepney/base/common/lifecycle';
import { ILifecycleService, LifecyclePhase } from 'jeepney/platform/lifecycle/lifecycle';
import { IWindowService } from 'jeepney/platform/windows/common/windows';

export class ElectronWindow extends Disposable {

    private canvas : HTMLCanvasElement;

    constructor(
        @IWindowService private readonly windowService : IWindowService,
        @ILifecycleService private readonly lifecycleService : ILifecycleService
    ) {
        super();

        let flag : boolean = true;

        this.registerListeners();
        this.create();

    }

    private create() : void {

        // Emit event when jeepney is ready
		this.lifecycleService.when(LifecyclePhase.Ready).then(() => ipc.send('jeepney:workbenchReady', this.windowService.windowId));

    }

    private createCentralWidget() : void {
        this.canvas = document.createElement('canvas');
        let ctx : any = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.backgroundColor = 'red';
        document.body.appendChild(this.canvas);
    }

    private registerListeners() : void {

        // Fullscreen events
        ipc.on('jeepney:enterFullScreen', async () => {
            console.log('When I Turn Out The Lights');
        });

    }

}