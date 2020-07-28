import { DApi } from 'ontology-dapi';
import { Crypto } from 'ontology-ts-sdk';
import PrivateKey = Crypto.PrivateKey;

import { BaseProviderOptions } from './types';
import Client from './client';
import AssetApi from './asset';
import IdentityApi from './identity';
import MessageApi from './message';
import NetworkApi from './network';
import ProviderApi from './provider';
import SmartContractApi from './smartContract';
import UtilsApi from './utils';

export default class BaseProvider implements DApi {
  readonly client: Client;
  readonly asset: AssetApi;
  readonly identity: IdentityApi;
  readonly message: MessageApi;
  readonly network: NetworkApi;
  readonly provider: ProviderApi;
  readonly smartContract: SmartContractApi;
  readonly utils: UtilsApi;

  static create(options: BaseProviderOptions): BaseProvider {
    return new BaseProvider(options);
  }

  constructor(public readonly options: BaseProviderOptions) {
    this.client = new Client(this);
    this.asset = new AssetApi(this);
    this.identity = new IdentityApi(this);
    this.message = new MessageApi(this);
    this.network = new NetworkApi(this);
    this.provider = new ProviderApi(this);
    this.smartContract = new SmartContractApi(this);
    this.utils = new UtilsApi(this);
  }

  getPrivateKey(): PrivateKey {
    const mnemonic = this.options.mnemonic;
    const privateKey = this.options.privateKey;
    const algorithm = this.options.algorithm;
    const KeyParameters = this.options.KeyParameters;

    if (mnemonic) {
      return PrivateKey.generateFromMnemonic(mnemonic, "m/44'/1024'/0'/0/0");
    }
    if (privateKey) {
      return new PrivateKey(privateKey, algorithm, KeyParameters);
    }
    throw new Error('NO_ACCOUNT');
  }

  destory() {
    this.client.close();
  }
}
