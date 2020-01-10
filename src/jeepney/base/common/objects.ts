import { isObject } from 'jeepney/base/common/types';

export function deepFreeze<T>(obj: T): T {
	if (!obj || typeof obj !== 'object') {
		return obj;
	}
	const stack: any[] = [obj];
	while (stack.length > 0) {
		const obj = stack.shift();
		Object.freeze(obj);
		for (const key in obj) {
			if (_hasOwnProperty.call(obj, key)) {
				const prop = obj[key];
				if (typeof prop === 'object' && !Object.isFrozen(prop)) {
					stack.push(prop);
				}
			}
		}
	}
	return obj;
}

const _hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Copies all properties of source into destination. The optional parameter "overwrite" allows to control
 * if existing properties on the destination should be overwritten or not. Defaults to true (overwrite).
 */
export function mixin(destination: any, source: any, overwrite: boolean = true): any {
	if (!isObject(destination)) {
		return source;
	}

	if (isObject(source)) {
		Object.keys(source).forEach(key => {
			if (key in destination) {
				if (overwrite) {
					if (isObject(destination[key]) && isObject(source[key])) {
						mixin(destination[key], source[key], overwrite);
					} else {
						destination[key] = source[key];
					}
				}
			} else {
				destination[key] = source[key];
			}
		});
	}
	return destination;
}