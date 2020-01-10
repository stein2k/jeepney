import { createDecorator } from 'jeepney/platform/instantiation/common/instantiation';
import { memoize } from 'jeepney/base/common/decorators';

export interface ParsedArgs {
    extensionDevelopmentPath?: string | string[]; // one or more local paths or URIs
}

export const IEnvironmentService = createDecorator<IEnvironmentService>('environmentService');

export interface IEnvironmentService {
    _serviceBrand: any;

    isExtensionDevelopment: boolean;

    isBuilt: boolean;

}

export class EnvironmentService implements IEnvironmentService {

    _serviceBrand: any;

    constructor(private _args: ParsedArgs, private _execPath: string) {
    }

    @memoize
    get isExtensionDevelopment(): boolean { return !!this._args.extensionDevelopmentPath; }
    
    get isBuilt(): boolean { return !process.env['VSCODE_DEV']; }

}