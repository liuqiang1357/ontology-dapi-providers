import { DApi, client } from 'ontology-dapi';

export default class CyanoProvider {
  static initialized = false;

  static getInstance(): DApi {
    if (!this.initialized) {
      client.registerClient({});
      this.initialized = true;
    }
    return client.api;
  }
}
