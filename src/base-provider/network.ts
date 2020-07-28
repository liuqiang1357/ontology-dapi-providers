import { Crypto } from 'ontology-ts-sdk';
import Address = Crypto.Address;
import {
  NetworkApi,
  MerkleProof,
  Block,
  Network,
  Transaction,
  GasPrice,
  Balance,
  Contract,
  BlockWithTxList
} from 'ontology-dapi';
import DApiBaseProvider from '../base-provider';
import { decodeAmount } from './number';

export default class NetworkApiImp implements NetworkApi {
  constructor(public dApi: DApiBaseProvider) {}

  async getNodeCount(): Promise<number> {
    const client = this.dApi.client.getClient();
    const response = await client.getNodeCount();
    return response.Result;
  }

  async getBlockHeight(): Promise<number> {
    const client = this.dApi.client.getClient();
    const response = await client.getBlockHeight();
    return response.Result;
  }

  async getMerkleProof({ txHash }: { txHash: string }): Promise<MerkleProof> {
    const client = this.dApi.client.getClient();
    const response = await client.getMerkleProof(txHash);
    return response.Result;
  }

  async getStorage({ contract, key }: { contract: string; key: string }): Promise<string> {
    const client = this.dApi.client.getClient();
    const response = await client.getStorage(contract, key);
    return response.Result;
  }

  async getAllowance({
    asset,
    fromAddress,
    toAddress
  }: {
    asset: string;
    fromAddress: string;
    toAddress: string;
  }): Promise<number> {
    const client = this.dApi.client.getClient();
    const response = await client.getAllowance(asset, new Address(fromAddress), new Address(toAddress));
    return response.Result;
  }

  async getBlock({ block }: { block: string | number }): Promise<Block> {
    const client = this.dApi.client.getClient();
    const response = await client.getBlockJson(block);
    return response.Result;
  }

  async getTransaction({ txHash }: { txHash: string }): Promise<Transaction> {
    const client = this.dApi.client.getClient();
    const response = await client.getRawTransactionJson(txHash);
    return response.Result;
  }

  async getNetwork(): Promise<Network> {
    return {
      type: this.dApi.client.getNetworkType(),
      address: this.dApi.client.getNetworkAddress()
    };
  }

  async getBalance({ address }: { address: string }): Promise<Balance> {
    const client = this.dApi.client.getClient();
    const response = await client.getBalance(new Address(address));
    return {
      ONG: decodeAmount(response.Result.ong, 9),
      ONT: response.Result.ont
    };
  }

  async isConnected(): Promise<boolean> {
    return this.dApi.client.isConnected();
  }

  async getUnboundOng({ address }: { address: string }): Promise<string> {
    const client = this.dApi.client.getClient();
    const response = await client.getUnboundong(new Address(address));
    return String(response.Result);
  }

  async getContract({ hash }: { hash: string }): Promise<Contract> {
    const client = this.dApi.client.getClient();
    const response = await client.getContractJson(hash);
    return response.Result;
  }

  async getSmartCodeEvent({ value }: { value: string | number }): Promise<any> {
    const client = this.dApi.client.getClient();
    const response = await client.getSmartCodeEvent(value);
    return response.Result;
  }

  async getBlockHeightByTxHash({ hash }: { hash: string }): Promise<number> {
    const client = this.dApi.client.getClient();
    const response = await client.getBlockHeightByTxHash(hash);
    return response.Result;
  }

  async getBlockHash({ height }: { height: number }): Promise<string> {
    const client = this.dApi.client.getClient();
    const response = await client.getBlockHash(height);
    return response.Result;
  }

  async getBlockTxsByHeight({ height }: { height: number }): Promise<BlockWithTxList> {
    const client = this.dApi.client.getClient();
    const response = await client.getBlockTxsByHeight(height);
    return response.Result;
  }

  async getGasPrice(): Promise<GasPrice> {
    const client = this.dApi.client.getClient();
    const response = await client.getGasPrice();
    return response.Result;
  }

  async getGrantOng({ address }: { address: string }): Promise<string> {
    const client = this.dApi.client.getClient();
    const response = await client.getGrantOng(new Address(address));
    return String(response.Result);
  }

  async getMempoolTxCount(): Promise<number[]> {
    const client = this.dApi.client.getClient();
    const response = await client.getMempoolTxCount();
    return response.Result;
  }

  async getMempoolTxState({ hash }: { hash: string }): Promise<any> {
    const client = this.dApi.client.getClient();
    const response = await client.getMempoolTxState(hash);
    return response.Result;
  }

  async getVersion(): Promise<string> {
    const client = this.dApi.client.getClient();
    const response = await client.getVersion();
    return response.Result;
  }
}
