import { Crypto, utils } from 'ontology-ts-sdk';
import { MessageApi, Signature } from 'ontology-dapi';
import DApiBaseProvider from '../base-provider';

export default class MessageApiImp implements MessageApi {
  constructor(public dApi: DApiBaseProvider) {}

  async signMessageHash({ messageHash }: { messageHash: string }): Promise<Signature> {
    throw new Error('Method not implemented.');
  }

  async verifyMessageHash({ messageHash, signature }: { messageHash: string; signature: Signature }): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async signMessage({ message }: { message: string }): Promise<Signature> {
    const privateKey = this.dApi.getPrivateKey();
    const publicKey = privateKey.getPublicKey();

    const messageHex = utils.str2hexstr(message);
    const sig = await privateKey.sign(messageHex);

    return {
      data: sig.serializeHex(),
      publicKey: publicKey.serializeHex()
    };
  }

  async verifyMessage({ message, signature }: { message: string; signature: Signature }): Promise<boolean> {
    const messageHex = utils.str2hexstr(message);

    const sig = Crypto.Signature.deserializeHex(signature.data);
    const publicKey = Crypto.PublicKey.deserializeHex(new utils.StringReader(signature.publicKey));

    return publicKey.verify(messageHex, sig);
  }
}
