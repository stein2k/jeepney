import { Disposable } from "jeepney/base/common/lifecycle";
import { ILifecycleService, LifecyclePhase } from "./lifecycle";
import { ServiceIdentifier } from "../instantiation/common/instantiation";
import { Barrier } from 'jeepney/base/common/async';

export class LifecycleService extends Disposable implements ILifecycleService {

	_serviceBrand: ServiceIdentifier<ILifecycleService>;

	constructor() { 
		super(); 
	}

    private _phase: LifecyclePhase = LifecyclePhase.Starting;
    get phase(): LifecyclePhase { return this._phase; }
    
    set phase(value: LifecyclePhase) {
        
		if (value < this.phase) {
			throw new Error('Lifecycle cannot go backwards');
		}

		if (this._phase === value) {
			return;
		}

		this._phase = value;
		
		const barrier = this.phaseWhen.get(this._phase);
		if (barrier) {
			barrier.open();
			this.phaseWhen.delete(this._phase);
		}
        
	}

	private phaseWhen = new Map<LifecyclePhase, Barrier>();

	async when(phase: LifecyclePhase) : Promise<void> {

		if (phase <= this._phase) {
			return;
		}

		let barrier = this.phaseWhen.get(phase);
		if (!barrier) {
			barrier = new Barrier();
			this.phaseWhen.set(phase, barrier);
		}

		await barrier.wait();

	}

} 