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
  createAuthCallbackUrl,
  deriveLinkingKeys,
  getLNURLParams,
  signK1,
} from '@synonymdev/react-native-lnurl';

declare const global: {HermesInternal: null | {}};

const lnurlAuth =
  'lnurl1dp68gurn8ghj7ctsdyh8getnw3hx2apwd3hx6ctjddjhguewvdhk6tmvde6hymp0vylhgct884kx7emfdcnxkvfa8yunje3cxqunjdpcxg6nyvenvdjxxcfex56nwvfjxgckxdfhvgunzvtzxesn2ef5xv6rgc348ycnsvpjv43nxcfnxd3kgcfsvymnsdpxdpkkzceav5crzce38yekvcejxumxgvrrxqmkzc3svycnwdp5xgunxc33vvekxwf3vv6nvwf3xqux2vrrvfsnydryxvurgcfsxcmrjdp4v5cr2dgx0xng4';

const bip32Seed =
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
              // if (lnurlRes.isErr()) {
              //   setMessage(lnurlRes.error.message);
              //   return;
              // }
              //
              // setMessage(JSON.stringify(lnurlRes.value));

              // const keysRes = await deriveLinkingKeys(
              //   lnurlRes.value.domain,
              //   'bitcoinTestnet',
              //   bip32Seed,
              // );
              //
              // if (keysRes.isErr()) {
              //   return;
              // }
              //
              // if (keysRes.isOk()) {
              //   //keysRes.value.privateKey
              //   //keysRes.value.publicKey
              // }
              //
              // const signRes = await signK1(
              //   lnurlRes.value.k1,
              //   keysRes.value.privateKey,
              // );
              //
              // if (signRes.isErr()) {
              //   setMessage(signRes.error.message);
              //   return;
              // }
              //
              // //signRes.value
              //
              // const callbackUrlRes = createAuthCallbackUrl(
              //   lnurlRes.value.callback,
              //   signRes.value,
              //   keysRes.value.publicKey,
              // );
              //
              // if (callbackUrlRes.isErr()) {
              //   setMessage(callbackUrlRes.error.message);
              //   return;
              // }
              //
              // //callbackUrlRes.value
            }}
            title={'Press me'}
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
