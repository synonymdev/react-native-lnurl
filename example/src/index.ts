import {createWithdrawCallbackUrl, createAuthCallbackUrl} from './decoding';

import {LNURLAuthParams, LNURLWithdrawParams} from 'js-lnurl';
import {EAvailableNetworks} from './utils/types';
import {err, ok, Result} from './utils/result';

const call = async (url: string): Promise<Result<string>> => {
  const fetchRes = await fetch(url);

  const body: {status: string; reason: string} = await fetchRes.json();

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
 * Creates the callback URL and calls it
 * @param walletSeed
 * @param network
 * @param params
 * @returns {Promise<Err<unknown> | Ok<string> | Err<string>>}
 */
export const lnAuth = async (
  walletSeed: string,
  network: EAvailableNetworks,
  params: LNURLAuthParams,
): Promise<Result<string>> => {
  const res = await createAuthCallbackUrl({walletSeed, network, params});
  if (res.isErr()) {
    return err(res.error);
  }

  return await call(res.value);
};

/**
 * Calls LNURL-WITHDRAW callback with newly created invoice.
 * Url needs to be decoded first so invoice can be created with correct amounts.
 * @param url
 * @param invoice
 */
export const lnWithdraw = async (
  params: LNURLWithdrawParams,
  paymentRequest: string,
): Promise<Result<string>> => {
  const callbackUrlRes = createWithdrawCallbackUrl(
    params.callback,
    params.k1,
    paymentRequest,
  );
  if (callbackUrlRes.isErr()) {
    return err(callbackUrlRes.error);
  }

  return await call(callbackUrlRes.value);
};

export const test = (): string => 'test';

export * from './signing';
export * from './decoding';
