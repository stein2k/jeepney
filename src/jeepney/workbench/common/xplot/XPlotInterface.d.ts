import { Disposable } from "jeepney/base/common/lifecycle";

export interface IXPlotInterface {
    foo() : number;
}

declare class XPlotInterface implements IXPlotInterface {
    foo() : number;
}