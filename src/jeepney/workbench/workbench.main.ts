import 'jeepney/workbench/electron-browser/main';

//#region --- workbench services
import { registerSingleton } from 'jeepney/platform/instantiation/common/extensions';
import { LifecycleService } from 'jeepney/platform/lifecycle/lifecycleService';
import { ILifecycleService } from 'jeepney/platform/lifecycle/lifecycle';

import 'jeepney/workbench/services/windowService';

registerSingleton(ILifecycleService, LifecycleService);