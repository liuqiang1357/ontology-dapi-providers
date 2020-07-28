import { Crypto, TransactionBuilder, utils } from 'ontology-ts-sdk';
import Address = Crypto.Address;
import { buildInvokePayload } from 'ontology-ts-test';
import { SmartContractApi, Parameter, Response } from 'ontology-dapi';
import DApiBaseProvider from '../base-provider';

export default class SmartContractApiImp implements SmartContractApi {
  constructor(public dApi: DApiBaseProvider) {}

  async invoke(options: any): Promise<Response> {
    const contract = options.scriptHash !== undefined ? options.scriptHash : options.contract;
    const method = options.operation !== undefined ? options.operation : options.method;
    const parameters = options.args !== undefined ? options.args : options.parameters;
    const gasPrice = options.gasPrice !== undefined ? options.gasPrice : 500;
    const gasLimit = options.gasLimit !== undefined ? options.gasLimit : 30000;

    const params = convertParams(parameters);
    const payload = buildInvokePayload(contract, method, params);
    const account = await this.dApi.asset.getAccount();
    const tx = TransactionBuilder.makeInvokeTransaction(
      method,
      [],
      new Address(utils.reverseHex(contract)),
      String(gasPrice),
      String(gasLimit),
      new Address(account)
    );
    (tx.payload as any).code = payload.toString('hex');

    const privateKey = this.dApi.getPrivateKey();
    await TransactionBuilder.signTransactionAsync(tx, privateKey);

    const client = this.dApi.client.getClient();
    const response =  await client.sendRawTransaction(tx.serialize(), false, true);

    if (response.Result.State === 0) {
      throw new Error('OTHER');
    }
    const notify = response.Result.Notify.filter((element: any) => element.ContractAddress === contract).map(
      (element: any) => element.States,
    );
    return {
      results: notify,
      transaction: response.Result.TxHash,
    };
  }

  async invokeRead(options: any): Promise<any> {
    const contract = options.scriptHash !== undefined ? options.scriptHash : options.contract;
    const method = options.operation !== undefined ? options.operation : options.method;
    const parameters = options.args !== undefined ? options.args : options.parameters;

    const params = convertParams(parameters);
    const payload = buildInvokePayload(contract, method, params);
    const tx = TransactionBuilder.makeInvokeTransaction(method, [], new Address(utils.reverseHex(contract)));
    (tx.payload as any).code = payload.toString('hex');

    const client = this.dApi.client.getClient();
    const response = await client.sendRawTransaction(tx.serialize(), true, false);
    if (response.Result.State === 0) {
      throw new Error('OTHER');
    }
    return response.Result.Result
  }

  async deploy({
    code,
    name,
    version,
    author,
    email,
    description,
    needStorage,
    gasPrice,
    gasLimit
  }: {
    code: string;
    name?: string;
    version?: string;
    author?: string;
    email?: string;
    description?: string;
    needStorage?: boolean;
    gasPrice?: number;
    gasLimit?: number;
  }): Promise<void> {
    gasPrice = gasPrice !== undefined ? gasPrice : 500;
    gasLimit = gasLimit !== undefined ? gasLimit : 30000;

    const account = await this.dApi.asset.getAccount();
    const tx = TransactionBuilder.makeDeployCodeTransaction(
      code,
      name,
      version,
      author,
      email,
      description,
      needStorage,
      String(gasPrice),
      String(gasLimit),
      new Address(account)
    );

    const privateKey = this.dApi.getPrivateKey();
    await TransactionBuilder.signTransactionAsync(tx, privateKey);

    const client = this.dApi.client.getClient();
    return await client.sendRawTransaction(tx.serialize(), false, true);
  }
}

function convertParams(parameters?: Parameter[]): any[] {
  if (parameters === undefined) {
    return [];
  }
  return parameters.map((p) => convertParam(p));
}

function convertMapParams(map: any) {
  const obj: any = {};
  for (const prop in map) {
    if (map.hasOwnProperty(prop)) {
      obj[prop] = convertParam(map[prop]);
    }
  }
  return obj;
}

function convertParam(parameter: Parameter) {
  if (parameter.type === 'Boolean') {
    return parameter.value === true || parameter.value === 'true';
  } else if (parameter.type === 'Integer') {
    return Number(parameter.value);
  } else if (parameter.type === 'ByteArray') {
    return new Buffer(parameter.value, 'hex');
  } else if (parameter.type === 'String') {
    return parameter.value;
  } else if (parameter.type === 'Array') {
    return convertParams(parameter.value);
  } else if (parameter.type === 'Map') {
    return convertMapParams(parameter.value);
  } else {
    // send as is, so underlying library can process it
    return parameter.value;
  }
}
