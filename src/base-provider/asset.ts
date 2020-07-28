import { AssetApi } from 'ontology-dapi';
import { CONST, Crypto, OntAssetTxBuilder, TransactionBuilder } from 'ontology-ts-sdk';
import Address = Crypto.Address;
import DApiBaseProvider from '../base-provider';

export default class AssetApiImp implements AssetApi {
  constructor(public dApi: DApiBaseProvider) {}

  async getAccount(): Promise<string> {
    const privateKey = this.dApi.getPrivateKey();
    return Address.fromPubKey(privateKey.getPublicKey()).toBase58();
  }

  async getPublicKey(): Promise<string> {
    const privateKey = this.dApi.getPrivateKey();
    return privateKey.getPublicKey().serializeHex();
  }

  async send({ to, asset, amount }: { to: string; asset: string; amount: number }): Promise<string> {
    const from = await this.getAccount();
    const tx = OntAssetTxBuilder.makeTransferTx(
      asset,
      new Address(from),
      new Address(to),
      String(amount),
      '500',
      `${CONST.DEFAULT_GAS_LIMIT}`
    );

    const privateKey = this.dApi.getPrivateKey();
    await TransactionBuilder.signTransactionAsync(tx, privateKey);

    const response = await this.dApi.client.getClient().sendRawTransaction(tx.serialize(), false, true);
    if (response.Result.State === 0) {
      throw new Error('OTHER');
    }
    return response.Result.TxHash;
  }
}
