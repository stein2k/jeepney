import { Dimension } from 'jeepney/base/browser/dom';
import { Component } from "jeepney/workbench/common/component";
import { IComposite } from 'jeepney/workbench/common/composite';

export abstract class Composite extends Component implements IComposite {

    /**
	 * Layout the contents of this composite using the provided dimensions.
	 */
	abstract layout(dimension: Dimension): void;

}