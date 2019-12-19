// import { IXPlotInterface, XPlotInterface} from 'jeepney/workbench/common/xplot/XPlotInterface';
import { Disposable } from 'jeepney/base/common/lifecycle';
import { IInstantiationService } from 'jeepney/platform/instantiation/common/instantiation';
import { IWindowService } from 'jeepney/platform/windows/common/windows';
import { Emitter, Event } from 'jeepney/base/common/event';
var addon = require('bindings')('XPlotInterface');

export class XPlotFrame extends Disposable {

    private _onPlotRefresh = this._register(new Emitter<void>());
    readonly onPlotRefresh : Event<void> = this._onPlotRefresh.event;

    constructor(flag : boolean) {
        super();

        console.log('creating xplot interface');
        console.log(addon);

        // create XPlot interface
        if (flag) {
            // this._xplotInterface = new XPlotInterface();
        }

        console.log('created xplot interface');

    }

}