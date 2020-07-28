import { IdentityApi, OntIdDDO, OntIdAttribute } from 'ontology-dapi';
import DApiBaseProvider from '../base-provider'

export default class IdentityApiImp implements IdentityApi {
  constructor(public dApi: DApiBaseProvider) {}

  async getIdentity(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async getDDO({ identity }: { identity: string }): Promise<OntIdDDO> {
    throw new Error('Method not implemented.');
  }

  async addAttributes({ attributes }: { attributes: OntIdAttribute[] }): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async removeAttribute({ key }: { key: string }): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
