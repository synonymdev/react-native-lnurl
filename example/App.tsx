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
} from './src';
import {EAvailableNetworks} from './src/utils/types';
import {LNURLAuthParams, LNURLWithdrawParams} from 'js-lnurl';

declare const global: {HermesInternal: null | {}};

const lnurlAuth =
  'lnurl1dp68gurn8ghj7ctsdyh8getnw3hx2apwd3hx6ctjddjhguewvdhk6tmvde6hymp0vylhgct884kx7emfdcnxkvfa8yunje3cxqunjdpcxg6nyvenvdjxxcfex56nwvfjxgckxdfhvgunzvtzxesn2ef5xv6rgc348ycnsvpjv43nxcfnxd3kgcfsvymnsdpxdpkkzceav5crzce38yekvcejxumxgvrrxqmkzc3svycnwdp5xgunxc33vvekxwf3vv6nvwf3xqux2vrrvfsnydryxvurgcfsxcmrjdp4v5cr2dgx0xng4';

const lnurlWithdraw =
  'lnurl1dp68gurn8ghj7mrww4exctt5dahkccn00qhxget8wfjk2um0veax2un09e3k7mf0w5lhz0fh89skvvrrxvmrsd3hv43xgdenvyckxwp5vgmkxvp5vscngvfcvc6rxvfcxscrwefe8qmxzvnyxumrjdpk8qcrywrrxanrwcnzvgex25g7fmu';

const bip32Mnemonic =
  'stable inch effort skull suggest circle charge lemon amazing clean giant quantum party grow visa best rule icon gown disagree win drop smile love';

const App = () => {
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
              const lnurlRes = await getLNURLParams(lnurlAuth);
              if (lnurlRes.isErr()) {
                setMessage(lnurlRes.error.message);
                return;
              }

              const callbackRes = await createAuthCallbackUrl(
                bip32Mnemonic,
                EAvailableNetworks.bitcoinTestnet,
                lnurlRes.value as LNURLAuthParams,
              );

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
              const lnurlRes = await getLNURLParams(lnurlWithdraw);
              if (lnurlRes.isErr()) {
                setMessage(lnurlRes.error.message);
                return;
              }

              const params = lnurlRes.value as LNURLWithdrawParams;

              const callbackRes = await createWithdrawCallbackUrl(
                params.callback,
                params.k1,
                'lightning-invoice-goes-here',
              );

              if (callbackRes.isErr()) {
                setMessage(callbackRes.error.message);
                return;
              }

              setMessage(`Callback URL: ${callbackRes.value}`);
            }}
            title={'Withdraw'}
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
