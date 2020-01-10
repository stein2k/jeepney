import { Disposable } from 'jeepney/base/common/lifecycle';
import { ServiceIdentifier, createDecorator } from 'jeepney/platform/instantiation/common/instantiation';
import { IChannel } from 'jeepney/base/parts/ipc/common/ipc';
import { Client } from 'jeepney/base/parts/ipc/ipc.electron-browser';

export const IMainProcessService = createDecorator<IMainProcessService>('mainProcessService');

export interface IMainProcessService {

	_serviceBrand: ServiceIdentifier<any>;
	
	getChannel(channelName: string): IChannel;

}

export class MainProcessService extends Disposable implements IMainProcessService {

    _serviceBrand: ServiceIdentifier<any>;

    private mainProcessConnection: Client;

    constructor(
		windowId: number
	) {
		super();

		this.mainProcessConnection = this._register(new Client(`window:${windowId}`));
	}

	getChannel(channelName: string): IChannel {
		return this.mainProcessConnection.getChannel(channelName);
	}

}