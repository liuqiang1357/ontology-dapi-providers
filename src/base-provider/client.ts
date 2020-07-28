import { CONST, WebsocketClient } from 'ontology-ts-sdk';
import { NetworkType } from 'ontology-dapi';
import DApiBaseProvider from '../base-provider';

export default class Client {
  private client: WebsocketClient;
  private interval: NodeJS.Timer;
  private connected: boolean = false;

  constructor(public dApi: DApiBaseProvider) {
    this.reconnect();
  }

  getNetworkType(): NetworkType {
    const networkType = this.dApi.options.networkType;
    if (networkType) {
      return networkType;
    }
    const networkAddress = this.dApi.options.networkAddress;
    return networkAddress ? 'PRIVATE' : 'TEST';
  }

  getNetworkAddress(): string {
    const networkAddress = this.dApi.options.networkAddress;
    if (networkAddress) {
      return networkAddress;
    }
    const networkType = this.getNetworkType();
    if (networkType === 'MAIN') {
      return CONST.MAIN_NODE;
    } else if (networkType === 'TEST') {
      return CONST.TEST_NODE;
    }
    throw new Error('Wrong net');
  }

  private constructUrl(): string {
    const useSSL = this.dApi.options.useSSL;
    const networkAddress = this.getNetworkAddress();
    if (networkAddress != null) {
      return `${useSSL ? 'wss' : 'ws'}://${networkAddress}:${CONST.HTTP_WS_PORT}`;
    }
    throw new Error('Can not construct address');
  }

  private reconnect() {
    if (this.client) {
      this.close();
    }
    const url = this.constructUrl();
    this.client = new WebsocketClient(url, false, false);
    this.interval = setInterval(async () => {
      try {
        await this.client.sendHeartBeat();
      } catch (e) {
        this.reconnect();
      }
    }, 5000);
  }

  close() {
    try {
      this.client.close();
    } catch (e) {
      // ignore
    }
    clearInterval(this.interval);
  }

  getClient(): WebsocketClient {
    return this.client;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
