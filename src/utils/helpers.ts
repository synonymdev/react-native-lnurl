import queryString from 'query-string';

/**
 * Add query params to given url
 * @param url
 * @param params
 * @returns {string}
 */
export const addUrlParams = (
	url: string,
	params: queryString.StringifiableRecord,
	options?: queryString.StringifyOptions
): string => {
	const parsed = queryString.parseUrl(url, options);
	Object.entries(params).forEach(([k, v]) => {
		parsed.query[k] = String(v);
	});
	return queryString.stringifyUrl(parsed, options);
};

/**
 * Convert string to bytes
 * @param str
 * @returns {Uint8Array}
 */
export const stringToBytes = (str: string): Uint8Array => {
	return Uint8Array.from(str, (x) => x.charCodeAt(0));
};

/**
 * Converts bytes to readable string
 * @returns {string}
 * @param bytes
 */
export const bytesToString = (bytes: Uint8Array): string => {
	const arr: number[] = [];
	bytes.forEach((n) => arr.push(n));
	return String.fromCharCode.apply(String, arr);
};

/**
 * Converts bytes to hex string
 * @param bytes
 * @returns {string}
 */
export const bytesToHexString = (bytes: Uint8Array): string => {
	return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
};

/**
 * Converts hex string to bytes
 * @param hexString
 * @returns {Uint8Array}
 */
export const hexStringToBytes = (hexString: string): Uint8Array => {
	return new Uint8Array((hexString.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)));
};

/**
 * Split '_' separated words and convert to uppercase
 * @param  {string} value     The input string
 * @param  {string} separator The separator to be used
 * @param  {string} split     The split char that concats the value
 * @return {string}           The words conected with the separator
 */
export const toCaps = (
	value: string = '',
	separator: string = ' ',
	split: string = '-'
): string => {
	return value
		.split(split)
		.map((v) => v.charAt(0).toUpperCase() + v.substring(1))
		.reduce((a, b) => `${a}${separator}${b}`);
};

/**
 * Converts bytes to a long
 * @param bytes
 * @returns {number}
 */
export const bytesToLong = (bytes: Uint8Array): number => {
	let value = 0;
	for (let i = bytes.length - 1; i >= 0; i--) {
		value = value * 256 + bytes[i];
	}

	return value;
};

/**
 * Random nonce to prevent URL's from caching
 * @returns {string}
 */
export const randomNonce = (): string => {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 8; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};
