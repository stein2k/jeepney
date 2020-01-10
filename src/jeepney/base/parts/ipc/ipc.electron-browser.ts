import { IDisposable } from 'jeepney/base/common/lifecycle';
import { IPCClient } from 'jeepney/base/parts/ipc/common/ipc';
import { Protocol } from 'jeepney/base/parts/ipc/ipc.electron';

export class Client extends IPCClient implements IDisposable {

    private static createProtocol(): Protocol {
        return new Protocol();
    }

    constructor(id: string) {
        const protocol = Client.createProtocol();
        super(protocol);
    }

}