import {
	getParams,
	LNURLAuthParams,
	LNURLChannelParams,
	LNURLPayParams,
	LNURLResponse,
	LNURLWithdrawParams
} from 'js-lnurl';
import { err, ok, Result } from './utils/result';
import { deriveLinkingKeys, signK1 } from './signing';
import { AuthCallback, ChannelCallback, PayCallback, WithdrawCallback } from './utils/types';
import { randomNonce } from './utils/helpers';

/**
 * Parses LNURL
 * @param url
 * @returns {Promise<Err<unknown> | Ok<LNURLResponse | LNURLAuthParams | LNURLPayParams>>}
 */
export const getLNURLParams = async (
	url: string
): Promise<
	Result<
		LNURLAuthParams | LNURLWithdrawParams | LNURLResponse | LNURLChannelParams | LNURLPayParams
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
			case 'withdrawRequest':
			case 'login':
			case 'channelRequest':
			case 'payRequest': {
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
 * @returns {Promise<Err<unknown> | Ok<string>>}
 * @param params
 * @param walletSeed
 * @param network
 */
export const createAuthCallbackUrl = async ({
	params,
	network,
	bip32Mnemonic,
	bip39Passphrase
}: AuthCallback): Promise<Result<string>> => {
	const keysRes = await deriveLinkingKeys(params.domain, network, bip32Mnemonic, bip39Passphrase);
	if (keysRes.isErr()) {
		return err(keysRes.error);
	}

	const signRes = await signK1(params.k1, keysRes.value.privateKey);
	if (signRes.isErr()) {
		return err(signRes.error);
	}

	return ok(`${params.callback}&sig=${signRes.value}&key=${keysRes.value.publicKey}`);
};

/**
 * Creates a withdraw callback URL once user's invoice
 * is ready to be paid
 * @param k1
 * @param callback
 * @param invoice
 * @return {Ok<string>}
 */
export const createWithdrawCallbackUrl = ({
	params: { k1, callback },
	paymentRequest
}: WithdrawCallback): Result<string> => {
	return ok(`${callback}${callback.endsWith('?') ? '' : '?'}&k1=${k1}&pr=${paymentRequest}`);
};

/**
 * Creates a channel request callback URL to call
 * after LN node has made it's connection.
 * @param k1
 * @param callback
 * @param localNodeId
 * @param isPrivate
 * @param cancel
 * @returns {Ok<string>}
 */
export const createChannelRequestUrl = ({
	params: { k1, callback },
	localNodeId,
	isPrivate,
	cancel
}: ChannelCallback): Result<string> => {
	return ok(
		`${callback}${callback.endsWith('?') ? '' : '?'}&k1=${k1}&remoteid=${localNodeId}&private=${
			isPrivate ? '1' : '0'
		}&cancel=${cancel ? '1' : '0'}`
	);
};

/**
 * Creates a pay request URL to call to get the invoice from
 * the remote node
 * @param callback
 * @param sats
 * @param comment
 * @param fromNodes
 */
export const createPayRequestUrl = ({
	params: { callback },
	milliSats,
	comment,
	fromNodes
}: PayCallback): Result<string> => {
	const nonce = randomNonce();
	const fromNodesParam = fromNodes ? `&fromnodes=${fromNodes.join(',')}` : '';

	return ok(
		`${callback}${
			callback.endsWith('?') ? '' : '?'
		}&amount=${milliSats}&nonce=${nonce}&comment=${comment}${fromNodesParam}`
	);
};
