const quartile = (arr: number[], q: number) => {
	if (!arr.length) return 0;

	const pos = (arr.length - 1) * q;
	const base = Math.floor(pos);
	if (arr.length % 2 === 0) {
		return (arr[base] + arr[base + 1]) / 2;
	}
	return q >= 0.75 && arr.length % 2 !== 0 ? arr[base + 1] : arr[base];
};

/**
 * IQR Range is used to get the outliers of a dataset
 */
type IQRRange = [number, number]

/**
 * Returns the interquartile range of an dataset input used to find outliers
 *
 * @return {IQRRange} set of range numbers from min to max
 */
export const InterquartileRange = (dataset: number[]): IQRRange => {
	const sortedSet = dataset.sort((a, b) => a - b);
	const q1 = quartile(sortedSet, 0.25);
	const q3 = quartile(sortedSet, 0.75);

	const IQR = q3 - q1;
	return [q1 - 1.5 * IQR, q3 + 1.5 * IQR];
};
