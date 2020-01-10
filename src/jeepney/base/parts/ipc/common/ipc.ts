import { IDisposable } from 'jeepney/base/common/lifecycle';

export interface IChannel {

}

export interface IChannelClient {

}

export interface IMessagePassingProtocol {
}

export class ChannelClient implements IChannelClient, IDisposable {

	constructor(private protocol: IMessagePassingProtocol) {
	}

	getChannel<T extends IChannel>(channelName: string) {
		return {
		} as T;
	}

	dispose(): void {
	}

}

export class IPCClient<TContext = string> implements IDisposable {

	private channelClient: ChannelClient;

	constructor(protocol: IMessagePassingProtocol) {
		this.channelClient = new ChannelClient(protocol);
	}

	getChannel<T extends IChannel>(channelName: string): T {
		return this.channelClient.getChannel(channelName) as T;
	}

	dispose(): void {
	}

}