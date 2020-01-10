import { Disposable } from "jeepney/base/common/lifecycle";
import { IChannel } from 'jeepney/base/parts/ipc/common/ipc';
import { IStorageDatabase } from "jeepney/base/parts/storage/common/storage";

export class GlobalStorageDatabaseChannelClient extends Disposable implements IStorageDatabase {

    _serviceBrand: any;

    constructor(private channel: IChannel) {
      super();
    }

}