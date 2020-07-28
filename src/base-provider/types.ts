import { Crypto } from 'ontology-ts-sdk';
import KeyType = Crypto.KeyType;
import KeyParameters = Crypto.KeyParameters;
import { NetworkType } from 'ontology-dapi';

export interface BaseProviderOptions {
  readonly privateKey?: string;
  readonly mnemonic?: string;
  readonly algorithm?: KeyType;
  readonly KeyParameters?: KeyParameters;
  readonly networkType?: NetworkType;
  readonly networkAddress?: string;
  readonly useSSL?: boolean;
}
