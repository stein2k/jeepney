import { mixin } from 'jeepney/base/common/objects';
import { IJeepneyWindow } from 'jeepney/platform/windows/electron-main/windows';
import { IWindowConfiguration, ReadyState } from 'jeepney/platform/windows/common/windows';
import { getPathFromAmdModule } from 'jeepney/base/common/amd';
import { BrowserWindow, ipcMain as ipc } from 'electron';
import { pathToFileURL } from 'url';
import * as path from 'path';

export class JeepneyWindow implements IJeepneyWindow {

    private canvas : HTMLCanvasElement;
    private _win : Electron.BrowserWindow;
    private _readyState: ReadyState;

    private readonly whenReadyCallbacks : { (window: IJeepneyWindow) : void }[];

    constructor() {

        this._readyState = ReadyState.NONE;
        this.whenReadyCallbacks = [];

        // create browser window
        this.createBrowserWindow();

        // register listeners
        this.registerListeners();

    }

    private createBrowserWindow() : void {

        const options : Electron.BrowserWindowConstructorOptions = {
            width: 800,
            height: 600,
            webPreferences: {
                backgroundThrottling: false,
                nodeIntegration: true,
                nodeIntegrationInWorker: false,
                webviewTag: true
            }
        };

        // create window configuration
        let config : IWindowConfiguration =  mixin({}, { appRoot: path.resolve(getPathFromAmdModule(require, '')) });

        // Create browser window.
        this._win = new BrowserWindow(options);
        this._win.loadURL(`${require.toUrl('jeepney/core/electron-browser/index.html')}?config=${encodeURIComponent(JSON.stringify(config))}`)

    }

    private registerListeners() : void {

        // React to workbench ready events from windows
        ipc.on('jeepney:workbenchReady', (event: Electron.Event, windowId: number) => {
            this.setReady();
        });

        // Window Fullscreen
        this._win.on('enter-full-screen', () => {
            this.sendWhenReady('jeepney:enterFullScreen');
        })

    }

    ready() : Promise<IJeepneyWindow> {
        return new Promise<IJeepneyWindow>(resolve => {
            if (this.isReady) {
                return resolve(this);
            }
			this.whenReadyCallbacks.push(resolve);
        });
    }

    setReady(): void {
        this._readyState = ReadyState.READY;

        // inform all waiting promises that we are ready now
        while (this.whenReadyCallbacks.length) {
            this.whenReadyCallbacks.pop()!(this);
        }
    }

    get isReady() : boolean {
        return this._readyState === ReadyState.READY;
    }

    sendWhenReady(channel: string, ...args: any[]) : void {
        if (this.isReady) {
            this.send(channel, ...args);
        } else {
            this.ready().then(() => this.send(channel, ...args));
        }

    }

    send(channel: string, ...args: any[]) : void {
        if (this._win) {
            this._win.webContents.send(channel, ...args);
        }
    }
};