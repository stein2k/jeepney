/**
 * @returns a new array with all false values removed. The original array IS NOT modified.
 */
export function coalesce<T>(array: ReadonlyArray<T | undefined | null>): T[] {
	if (!array) {
		return [...array];
	}
	return <T[]>array.filter(e => !!e);
}

export function range(to: number): number[];
export function range(from: number, to: number): number[];
export function range(arg: number, to?: number): number[] {
	let from = typeof to === 'number' ? arg : 0;

	if (typeof to === 'number') {
		from = arg;
	} else {
		from = 0;
		to = arg;
	}

	const result: number[] = [];

	if (from <= to) {
		for (let i = from; i < to; i++) {
			result.push(i);
		}
	} else {
		for (let i = from; i > to; i--) {
			result.push(i);
		}
	}

	return result;
}