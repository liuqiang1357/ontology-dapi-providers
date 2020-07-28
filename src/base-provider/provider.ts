import { ProviderApi, Provider } from 'ontology-dapi';
import DApiBaseProvider from '../base-provider';

declare const __VERSION__: string;

export default class ProviderApiImp implements ProviderApi {
  constructor(public dApi: DApiBaseProvider) {}

  async getProvider(): Promise<Provider> {
    return {
      name: "dapi-base-provider",
      version: __VERSION__,
      compatibility: ['OEP-6']
    };
  }
}
