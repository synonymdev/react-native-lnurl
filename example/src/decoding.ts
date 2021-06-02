import {
  getParams,
  LNURLAuthParams,
  LNURLChannelParams,
  LNURLPayParams,
  LNURLResponse,
  LNURLWithdrawParams,
} from 'js-lnurl';
import {err, ok, Result} from './utils/result';
import {deriveLinkingKeys, signK1} from './signing';
import {EAvailableNetworks} from './utils/types';

/**
 * Parses LNURL
 * @param url
 * @returns {Promise<Err<unknown> | Ok<LNURLResponse | LNURLAuthParams | LNURLPayParams>>}
 */
export const getLNURLParams = async (
  url: string,
): Promise<
  Result<
    | LNURLAuthParams
    | LNURLWithdrawParams
    | LNURLResponse
    | LNURLChannelParams
    | LNURLPayParams
  >
> => {
  try {
    const params = await getParams(url);

    const status = 'status' in params ? params.status : '';
    if (status === 'ERROR') {
      const reason = 'reason' in params ? params.reason : '';
      if (reason) {
        return err(reason);
      }

      return err('Unknown error parsing LNURL params');
    }

    const tag = 'tag' in params ? params.tag : '';

    switch (tag) {
      case 'withdrawRequest': {
        return ok(params);
      }

      case 'login': {
        return ok(params);
      }
    }

    return err(`${tag} not yet implemented`);
  } catch (e) {
    return err(e);
  }
};

/**
 * Creates a authorization callback URL
 * @param callback
 * @param signature
 * @param linkingPublicKey
 * @returns {Ok<string>}
 */
export const createAuthCallbackUrl = async (
  walletSeed: string,
  network: EAvailableNetworks,
  params: LNURLAuthParams,
): Promise<Result<string>> => {
  const keysRes = await deriveLinkingKeys(params.domain, network, walletSeed);
  if (keysRes.isErr()) {
    return err(keysRes.error);
  }

  const signRes = await signK1(params.k1, keysRes.value.privateKey);
  if (signRes.isErr()) {
    return err(signRes.error);
  }

  return ok(
    `${params.callback}&sig=${signRes.value}&key=${keysRes.value.publicKey}`,
  );
};

/**
 * Creates a withdraw callback URL
 * @param callback
 * @param k1
 * @param invoice
 * @returns {Ok<string>}
 */
export const createWithdrawCallbackUrl = (
  callback: string,
  k1: string,
  invoice: string,
): Result<string> => {
  return ok(
    `${callback}${callback.endsWith('?') ? '' : '?'}&k1=${k1}&pr=${invoice}`,
  );
};
