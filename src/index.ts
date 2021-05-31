import { createWithdrawCallbackUrl, createAuthCallbackUrl } from './decoding';
import { deriveLinkingKeys, signK1 } from './signing';

import { LNURLAuthParams, LNURLWithdrawParams } from 'js-lnurl';
import { EAvailableNetworks } from './utils/types';
import { err, ok, Result } from './utils/result';

const call = async (url: string): Promise<Result<string>> => {
	const fetchRes = await fetch(url);

	const body: { status: string; reason: string } = await fetchRes.json();

	if (!body) {
		return err('Unknown HTTP error');
	}

	if ((body.status || '').toUpperCase() === 'OK') {
		return ok('Authenticated');
	} else if ((body.status || '').toUpperCase() === 'ERROR') {
		return err(body.reason);
	}

	return err('Unknown error');
};

/**
 * Authenticate with LNURL-AUTH
 * @param url
 * @returns {Promise<Err<unknown> | Ok<string>>}
 */
export const lnAuth = async (
	walletSeed: string,
	network: EAvailableNetworks,
	params: LNURLAuthParams
): Promise<Result<string>> => {
	const keysRes = await deriveLinkingKeys(params.domain, network, walletSeed);
	if (keysRes.isErr()) {
		return err(keysRes.error);
	}

	const signRes = await signK1(params.k1, keysRes.value.privateKey);
	if (signRes.isErr()) {
		return err(signRes.error);
	}

	const callbackUrlRes = createAuthCallbackUrl(
		params.callback,
		signRes.value,
		keysRes.value.publicKey
	);
	if (callbackUrlRes.isErr()) {
		return err(callbackUrlRes.error);
	}

	return await call(callbackUrlRes.value);
};

/**
 * Calls LNURL-WITHDRAW callback with newly created invoice.
 * Url needs to be decoded first so invoice can be created with correct amounts.
 * @param url
 * @param invoice
 */
export const lnWithdraw = async (
	params: LNURLWithdrawParams,
	paymentRequest: string
): Promise<Result<string>> => {
	const callbackUrlRes = createWithdrawCallbackUrl(params.callback, params.k1, paymentRequest);
	if (callbackUrlRes.isErr()) {
		return err(callbackUrlRes.error);
	}

	return await call(callbackUrlRes.value);
};

export const test = (): string => 'test';

export * from './signing';
export * from './decoding';
