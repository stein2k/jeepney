import 'jeepney/workbench/electron-browser/main';

//#region --- workbench services
import { registerSingleton } from 'jeepney/platform/instantiation/common/extensions';
import { LifecycleService } from 'jeepney/platform/lifecycle/lifecycleService';
import { ILifecycleService } from 'jeepney/platform/lifecycle/lifecycle';

import 'jeepney/workbench/services/themes/workbenchThemeService';
import 'jeepney/workbench/services/windowService';

//#region -- workbench parts
import 'jeepney/workbench/browser/parts/content/contentFrame';

registerSingleton(ILifecycleService, LifecycleService);