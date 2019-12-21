import { createDecorator } from "jeepney/platform/instantiation/common/instantiation";

export const IContentFrameService = createDecorator<IContentFrameService>('contentFrameService');

export interface IContentFrameService {
    _serviceBrand: any;
}