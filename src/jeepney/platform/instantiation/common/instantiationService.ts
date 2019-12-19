import { IdleValue } from 'jeepney/base/common/async';
import { SyncDescriptor } from 'jeepney/platform/instantiation/common/descriptors';
import { Graph } from 'jeepney/platform/instantiation/common/graph';
import { _util, IInstantiationService, optional, ServiceIdentifier, ServicesAccessor } from 'jeepney/platform/instantiation/common/instantiation';
import { ServiceCollection } from 'jeepney/platform/instantiation/common/serviceCollection';

// PROXY
// Ghetto-declare of the global Proxy object. This isn't the proper way
// but allows us to run this code in the browser without IE11.
declare var Proxy: any;
const _canUseProxy = typeof Proxy === 'function';

class CyclicDependencyError extends Error {
	constructor(graph: Graph<any>) {
		super('cyclic dependency between services');
		this.message = graph.toString();
	}
}

export class InstantiationService implements IInstantiationService {

    _serviceBrand: any;

    private readonly _services: ServiceCollection;
    private readonly _strict: boolean;
    private readonly _parent?: InstantiationService;

    constructor(services: ServiceCollection = new ServiceCollection(), strict: boolean = false, parent?: InstantiationService) {
		this._services = services;
		this._strict = strict;
		this._parent = parent;

		this._services.set(IInstantiationService, this);
    }
    
    createChild(services: ServiceCollection): IInstantiationService {
		return new InstantiationService(services, this._strict, this);
	}

    createInstance(ctorOrDescriptor: any | SyncDescriptor<any>, ...rest: any[]) : any {

        let result : any;

        if (ctorOrDescriptor instanceof SyncDescriptor) {
            result = this._createInstance(ctorOrDescriptor.ctor, ctorOrDescriptor.staticArguments.concat(rest));
        } else {
            result = this._createInstance(ctorOrDescriptor, rest);
        }

        return result;

    }

    invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R {
		let _done = false;
		try {
			const accessor: ServicesAccessor = {
				get: <T>(id: ServiceIdentifier<T>, isOptional?: typeof optional) => {

					if (_done) {
                        throw new Error('Illegal state: service accessor is only valid during the invocation of its target method');
					}

					const result = this._getOrCreateServiceInstance(id);
					if (!result && isOptional !== optional) {
						throw new Error(`[invokeFunction] unknown service '${id}'`);
					}
					return result;
				}
			};
			return fn.apply(undefined, [accessor, ...args]);
		} finally {
			_done = true;
		}
    }
    
    private _createAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: SyncDescriptor<T>): T {
		type Triple = { id: ServiceIdentifier<any>, desc: SyncDescriptor<any> };
		const graph = new Graph<Triple>(data => data.id.toString());

		let cycleCount = 0;
		const stack = [{ id, desc }];
		while (stack.length) {
			const item = stack.pop()!;
			graph.lookupOrInsertNode(item);

			// a weak but working heuristic for cycle checks
			if (cycleCount++ > 100) {
				throw new CyclicDependencyError(graph);
			}

			// check all dependencies for existence and if they need to be created first
			for (let dependency of _util.getServiceDependencies(item.desc.ctor)) {

				let instanceOrDesc = this._getServiceInstanceOrDescriptor(dependency.id);
				if (!instanceOrDesc && !dependency.optional) {
					console.warn(`[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`);
				}

				if (instanceOrDesc instanceof SyncDescriptor) {
					const d = { id: dependency.id, desc: instanceOrDesc };
					graph.insertEdge(item, d);
					stack.push(d);
				}
			}
		}

		while (true) {
			const roots = graph.roots();

			// if there is no more roots but still
			// nodes in the graph we have a cycle
			if (roots.length === 0) {
				if (!graph.isEmpty()) {
					throw new CyclicDependencyError(graph);
				}
				break;
			}

			for (const { data } of roots) {
				// create instance and overwrite the service collections
				const instance = this._createServiceInstanceWithOwner(data.id, data.desc.ctor, data.desc.staticArguments, data.desc.supportsDelayedInstantiation);
				this._setServiceInstance(data.id, instance);
				graph.removeNode(data);
			}
		}

		return <T>this._getServiceInstanceOrDescriptor(id);
	}

    private _createInstance<T>(ctor: any, args: any[] = []): T {

        // arguments defined by service decorators
		let serviceDependencies = _util.getServiceDependencies(ctor).sort((a, b) => a.index - b.index);
        let serviceArgs: any[] = [];
        
        for (const dependency of serviceDependencies) {
            let service = this._getOrCreateServiceInstance(dependency.id);
            if (!service && this._strict && !dependency.optional) {
                throw new Error(`[createInstance] ${ctor.name} depends on UNKNOWN service ${dependency.id}.`);
            }
            serviceArgs.push(service);
		}

        // now create the instance
        return <T>new ctor(...[...args, ...serviceArgs]);

    }

    private _createServiceInstance<T>(ctor: any, args: any[] = [], _supportsDelayedInstantiation: boolean): T {
		if (!_supportsDelayedInstantiation || !_canUseProxy) {
			// eager instantiation or no support JS proxies (e.g. IE11)
			return this._createInstance(ctor, args);

		} else {
			// Return a proxy object that's backed by an idle value. That
			// strategy is to instantiate services in our idle time or when actually
			// needed but not when injected into a consumer
			const idle = new IdleValue(() => this._createInstance<T>(ctor, args));
			return <T>new Proxy(Object.create(null), {
				get(_target: T, prop: PropertyKey): any {
					return (idle.getValue() as any)[prop];
				},
				set(_target: T, p: PropertyKey, value: any): boolean {
					(idle.getValue() as any)[p] = value;
					return true;
				}
			});
		}
	}

    private _createServiceInstanceWithOwner<T>(id: ServiceIdentifier<T>, ctor: any, args: any[] = [], supportsDelayedInstantiation: boolean): T {
		if (this._services.get(id) instanceof SyncDescriptor) {
			return this._createServiceInstance(ctor, args, supportsDelayedInstantiation);
		} else if (this._parent) {
			return this._parent._createServiceInstanceWithOwner(id, ctor, args, supportsDelayedInstantiation);
		} else {
			throw new Error('illegalState - creating UNKNOWN service instance');
		}
	}

    private _getServiceInstanceOrDescriptor<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T> {
		let instanceOrDesc = this._services.get(id);
		if (!instanceOrDesc && this._parent) {
			return this._parent._getServiceInstanceOrDescriptor(id);
		} else {
			return instanceOrDesc;
		}
	}

    private _getOrCreateServiceInstance<T>(id: ServiceIdentifier<T>): T {
		let thing = this._getServiceInstanceOrDescriptor(id);
		if (thing instanceof SyncDescriptor) {
			return this._createAndCacheServiceInstance(id, thing);
		} else {
			return thing;
		}
    }
    
    private _setServiceInstance<T>(id: ServiceIdentifier<T>, instance: T): void {
		if (this._services.get(id) instanceof SyncDescriptor) {
			this._services.set(id, instance);
		} else if (this._parent) {
			this._parent._setServiceInstance(id, instance);
		} else {
			throw new Error('illegalState - setting UNKNOWN service instance');
		}
	}

}