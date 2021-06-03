/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import './shim';
import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import {
  getLNURLParams,
  createAuthCallbackUrl,
  createWithdrawCallbackUrl,
  createChannelRequestUrl,
  createPayRequestUrl,
} from '../src';
import {EAvailableNetworks} from '../src/utils/types';
import {
  LNURLAuthParams,
  LNURLChannelParams,
  LNURLPayParams,
  LNURLWithdrawParams,
} from 'js-lnurl';

const bip32Mnemonic =
  'stable inch effort skull suggest circle charge lemon amazing clean giant quantum party grow visa best rule icon gown disagree win drop smile love';

const bip39Passphrase = 'shhhhh123';

const lnurlAuthReq =
  'lnurl1dp68gurn8ghj7ctsdyh8getnw3hx2apwd3hx6ctjddjhguewvdhk6tmvde6hymp0vylhgct884kx7emfdcnxkvfa8yunje3cxqunjdpcxg6nyvenvdjxxcfex56nwvfjxgckxdfhvgunzvtzxesn2ef5xv6rgc348ycnsvpjv43nxcfnxd3kgcfsvymnsdpxdpkkzceav5crzce38yekvcejxumxgvrrxqmkzc3svycnwdp5xgunxc33vvekxwf3vv6nvwf3xqux2vrrvfsnydryxvurgcfsxcmrjdp4v5cr2dgx0xng4';

const lnurlWithdrawReq =
  'lnurl1dp68gurn8ghj7mrww4exctt5dahkccn00qhxget8wfjk2um0veax2un09e3k7mf0w5lhz0fh89skvvrrxvmrsd3hv43xgdenvyckxwp5vgmkxvp5vscngvfcvc6rxvfcxscrwefe8qmxzvnyxumrjdpk8qcrywrrxanrwcnzvgex25g7fmu';

const lnurlChannelReq =
  'LNURL1DP68GURN8GHJ7MRWW4EXCTNZD9NHXATW9EU8J730D3H82UNV943KSCTWDEJKC0MNV4EHX6T0DC7NGC3JVVUX2WT9VYCRWENRV56KVCE5VYURGDRZXFSNWV33XSMNJCEK8QCRYCNZV3JR2DM9VCEK2C3J8PJRZERPVCMKGV3JX4JRSWFNV5P26TN2';

const lnurlPayReq =
  'LNURL1DP68GURN8GHJ7MRWW4EXCTNZD9NHXATW9EU8J730D3H82UNV94CXZ7FLWDJHXUMFDAHR6VE4XASNYDFEV93RWEPKXSURQDRYX3SNSV34XANRQERRV4JNZCTRVYURSDPSVVMRQDMZVEJNZC33VF3NVDFS8QMNWDTYXCEN2VP4X9NQQ3CAXL';

const App = (): React.ReactElement => {
  const [message, setMessage] = useState('');

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Text style={styles.message}>{message}</Text>

          <Button
            onPress={async () => {
              const lnurlRes = await getLNURLParams(lnurlAuthReq);
              if (lnurlRes.isErr()) {
                setMessage(lnurlRes.error.message);
                return;
              }

              const params = lnurlRes.value as LNURLAuthParams;

              const callbackRes = await createAuthCallbackUrl({
                params,
                network: EAvailableNetworks.bitcoinTestnet,
                bip32Mnemonic,
                bip39Passphrase,
              });

              if (callbackRes.isErr()) {
                setMessage(callbackRes.error.message);
                return;
              }

              setMessage(`Callback URL: ${callbackRes.value}`);
            }}
            title={'Auth'}
          />

          <Button
            onPress={async () => {
              const lnurlRes = await getLNURLParams(lnurlWithdrawReq);
              if (lnurlRes.isErr()) {
                setMessage(lnurlRes.error.message);
                return;
              }

              const params = lnurlRes.value as LNURLWithdrawParams;

              const callbackRes = await createWithdrawCallbackUrl({
                params,
                paymentRequest: 'lightning-invoice-goes-here',
              });

              if (callbackRes.isErr()) {
                setMessage(callbackRes.error.message);
                return;
              }

              setMessage(`Callback URL: ${callbackRes.value}`);
            }}
            title={'Withdraw'}
          />

          <Button
            onPress={async () => {
              const lnurlRes = await getLNURLParams(lnurlChannelReq);
              if (lnurlRes.isErr()) {
                setMessage(lnurlRes.error.message);
                return;
              }

              const params = lnurlRes.value as LNURLChannelParams;

              setMessage(params.uri);

              // Here our lightning wallet makes a connection to params.uri so remote node is a peer before we proceed

              const callbackRes = await createChannelRequestUrl({
                params,
                localNodeId:
                  '034ecfd567a64f06742ac300a2985676abc0b1dc6345904a08bb52d5418e685f79',
                isPrivate: true,
                cancel: false,
              });

              if (callbackRes.isErr()) {
                setMessage(callbackRes.error.message);
                return;
              }

              setMessage(`Callback URL: ${callbackRes.value}`);
            }}
            title={'Channel'}
          />

          <Button
            onPress={async () => {
              const lnurlRes = await getLNURLParams(lnurlPayReq);
              if (lnurlRes.isErr()) {
                setMessage(lnurlRes.error.message);
                return;
              }

              const params = lnurlRes.value as LNURLPayParams;

              // setMessage(JSON.stringify(Object.keys(params)));
              //
              // console.log(JSON.stringify(params));

              // User should receive a payment dialog here where they can enter the amount they wish to pay.
              // Amount must be between params.minSendable and params.maxSendable
              // User can be shown params.domain and params.metadata/params.decodedMetadata

              const milliSats = params.minSendable;

              const callbackRes = await createPayRequestUrl({
                params,
                milliSats,
                comment: 'Hey',
              });

              if (callbackRes.isErr()) {
                setMessage(callbackRes.error.message);
                return;
              }

              setMessage(`Callback URL: ${callbackRes.value}`);
            }}
            title={'Pay'}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
  },
  state: {
    textAlign: 'center',
  },
  message: {
    margin: 10,
    textAlign: 'center',
  },
});

export default App;
