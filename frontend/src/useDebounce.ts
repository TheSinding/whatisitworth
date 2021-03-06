import React, { useState, useEffect } from 'react';

// Our hook
export default function useDebounce(value: any, delay: number = 300) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => {
			clearTimeout(handler);
		};
	}, [value]);

	return debouncedValue;
}