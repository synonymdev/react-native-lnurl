import { LNURLWithdrawParams, LNURLPayResult } from 'js-lnurl';

import {
	createWithdrawCallbackUrl,
	createAuthCallbackUrl,
	createChannelRequestUrl,
	createPayRequestUrl
} from './decoding';
import { AuthCallback, ChannelCallback, PayCallback } from './utils/types';
import { err, ok, Result } from './utils/result';

const call = async (url: string): Promise<Result<string>> => {
	const fetchRes = await fetch(url);

	const body: { status: string; reason: string } = await fetchRes.json();

	if (!body) {
		return err('Unknown HTTP error');
	}

	if (body?.status?.toUpperCase() === 'OK') {
		return ok('Authenticated');
	}

	if (body?.status?.toUpperCase() === 'ERROR') {
		return err(body.reason);
	}

	return err('Unknown error');
};

const callLnurlPay = async (url: string): Promise<Result<LNURLPayResult>> => {
	const fetchRes = await fetch(url);

	const body: { status: string; reason: string } & LNURLPayResult = await fetchRes.json();

	if (!body) {
		return err('Unknown HTTP error');
	}

	if (body?.status?.toUpperCase() === 'ERROR') {
		return err(body.reason);
	}

	if (!(typeof body.pr === 'string')) {
		return err('LNURL pay response is invalid. "pr" is missing.');
	}

	// "routes" field is required by https://github.com/lnurl/luds/blob/luds/06.md
	// but we don't really use it
	if (!body.routes) {
		body.routes = [];
	}

	if (!Array.isArray(body.routes)) {
		return err('LNURL pay response is invalid. "routes" is not an array.');
	}

	return ok(body);
};

/**
 * Creates the callback URL and calls it
 * @param walletSeed
 * @param network
 * @param params
 * @returns {Promise<Err<unknown> | Ok<string> | Err<string>>}
 */
export const lnurlAuth = async (details: AuthCallback): Promise<Result<string>> => {
	const res = await createAuthCallbackUrl(details);
	if (res.isErr()) {
		return err(res.error);
	}

	return await call(res.value);
};

/**
 * Calls LNURL-WITHDRAW callback with newly created invoice.
 * Url needs to be decoded first so invoice can be created with correct amounts.
 * @param params
 * @param paymentRequest
 * @return {Promise<Err<unknown> | Ok<string> | Err<string>>}
 */
export const lnurlWithdraw = async (
	params: LNURLWithdrawParams,
	paymentRequest: string
): Promise<Result<string>> => {
	const callbackUrlRes = createWithdrawCallbackUrl({
		params,
		paymentRequest
	});
	if (callbackUrlRes.isErr()) {
		return err(callbackUrlRes.error);
	}

	return await call(callbackUrlRes.value);
};
/**
 * Calls LNURL-CHANNEL callback with the user's local node ID.
 * @param details
 * @return {Promise<Err<unknown> | Ok<string> | Err<string>>}
 */
export const lnurlChannel = async (details: ChannelCallback): Promise<Result<string>> => {
	const callbackUrlRes = createChannelRequestUrl(details);
	if (callbackUrlRes.isErr()) {
		return err(callbackUrlRes.error);
	}

	return await call(callbackUrlRes.value);
};

/**
 * Calls LNURL-PAY callback with the details the
 * receiver should use in their invoice
 * @param details
 * @return {Promise<Err<unknown> | Ok<string> | Err<string>>}
 */
export const lnurlPay = async (details: PayCallback): Promise<Result<LNURLPayResult>> => {
	const callbackUrlRes = createPayRequestUrl(details);
	if (callbackUrlRes.isErr()) {
		return err(callbackUrlRes.error);
	}

	return await callLnurlPay(callbackUrlRes.value);
	// TODO verify that h tag in provided invoice is a hash of metadata string converted to byte array in UTF-8 encoding.
	// TODO verify that amount in provided invoice equals an amount previously specified by user.
};

export * from './signing';
export * from './decoding';
