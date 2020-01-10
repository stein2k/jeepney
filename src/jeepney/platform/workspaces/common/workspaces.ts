import { URI } from 'jeepney/base/common/uri';

/**
 * A single folder workspace identifier is just the path to the folder.
 */
export type ISingleFolderWorkspaceIdentifier = URI;

export interface ISingleFolderWorkspaceInitializationPayload { id: string; folder: ISingleFolderWorkspaceIdentifier; }
export type IWorkspaceInitializationPayload = ISingleFolderWorkspaceInitializationPayload;