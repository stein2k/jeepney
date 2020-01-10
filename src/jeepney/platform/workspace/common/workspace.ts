import { createDecorator } from 'jeepney/platform/instantiation/common/instantiation';

export const IWorkspaceContextService = createDecorator<IWorkspaceContextService>('contextService');

export interface IWorkspaceContextService {
    _serviceBrand: any;
}

export namespace IWorkspace {}

export interface IWorkspace {}

export class Workspace implements IWorkspace {}