import {
  LNURLAuthParams,
  LNURLChannelParams,
  LNURLPayParams,
  LNURLWithdrawParams,
} from 'js-lnurl';

export enum EAvailableNetworks {
  bitcoin = 'bitcoin',
  bitcoinTestnet = 'bitcoinTestnet',
}

export type INetwork = {
  messagePrefix: string;
  bech32: string;
  bip32: {
    public: number;
    private: number;
  };
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
};

export type INetworks = {
  [key in EAvailableNetworks]: INetwork;
};

/*
Source: https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/networks.js
List of address prefixes: https://en.bitcoin.it/wiki/List_of_address_prefixes
 */
export const networks: INetworks = {
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
  },
  bitcoinTestnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
  },
};

export type AuthCallback = {
  network: EAvailableNetworks;
  params: LNURLAuthParams;
  bip32Mnemonic: string;
  bip39Passphrase?: string;
};

export type WithdrawCallback = {
  params: LNURLWithdrawParams;
  paymentRequest: string;
};

export type ChannelCallback = {
  params: LNURLChannelParams;
  localNodeId: string;
  isPrivate: boolean;
  cancel: boolean;
};

export type PayCallback = {
  params: LNURLPayParams;
  milliSats: number;
  fromNodes?: string[];
  comment: string;
};
