// import { JeepneyApplication } from 'jeepney/core/electron-main/app';
// import { InstantiationService } from 'jeepney/platform/instantiation/common/instantiationService';
// import { LifecycleService } from 'jeepney/platform/lifecycle/lifecycleService';
// import { ILifecycleService } from 'jeepney/platform/lifecycle/lifecycle';
// import { ServiceCollection } from 'jeepney/platform/instantiation/common/serviceCollection';
// import { SyncDescriptor } from 'jeepney/platform/instantiation/common/descriptors';
// import { IInstantiationService } from 'jeepney/platform/instantiation/common/instantiation';
// import * as hello from 'jeepney/hello';

// class JeepneyMain {

//     private app : JeepneyApplication | undefined; 
//     private instantiationService : InstantiationService | undefined;
//     private lifecycleService : ILifecycleService | undefined;

//     main() : void {

//         // Launch
//         this.startup();

//     }

//     private createServices() : [IInstantiationService, typeof undefined] {

//         const services = new ServiceCollection;

//         services.set(ILifecycleService, new SyncDescriptor(LifecycleService));

//         return [new InstantiationService(services, true), undefined];

//     }

//     private async startup() : Promise<void> {

//         // init services
//         const [instantiationService, instanceEnvironment] = this.createServices();

//         // // create instantiation service
//         // this.instantiationService = new InstantiationService;

//         // // create lifecycle service
//         // this.lifecycleService = new LifecycleService;

//         instantiationService.createInstance(JeepneyApplication).startup();
        
//         // create application instance
//         // this.app = new JeepneyApplication(this.lifecycleService);
//         // this.app.startup();


//     }

// };

// // Main Startup
// const code = new JeepneyMain();
// code.main();
import {hello} from 'jeepney/hello';
console.log("hello " + hello());