import { UtilsApi } from 'ontology-dapi/lib/types/api/utils';
import * as base58 from 'bs58';
import * as cryptoJS from 'crypto-js';
import DApiBaseProvider from '../base-provider';

export default class UtilsApiImp implements UtilsApi {
  constructor(public dApi: DApiBaseProvider) {}

  strToHex(str: string): string {
    return ab2hexstring(str2ab(str));
  }

  hexToStr(hex: string): string {
    return ab2str(hexstring2ab(hex));
  }

  addressToHex(str: string): string {
    return base58ToHex(str);
  }

  hexToAddress(str: string): string {
    return hexToBase58(str);
  }

  isAddress(str: string): boolean {
    try {
      base58ToHex(str);
      return true;
    } catch (_) {
      return false;
    }
  }
}

function base58ToHex(base58Encoded: string) {
  const decoded = base58.decode(base58Encoded);
  const hexEncoded = ab2hexstring(decoded).substr(2, 40);

  if (base58Encoded !== hexToBase58(hexEncoded)) {
    throw new Error('[addressToU160] decode encoded verify failed');
  }
  return hexEncoded;
}

const ADDR_VERSION = '17';

function hexToBase58(hexEncoded: string): string {
  const data = ADDR_VERSION + hexEncoded;

  const hash = sha256(data);
  const hash2 = sha256(hash);
  const checksum = hash2.slice(0, 8);

  const datas = data + checksum;

  return base58.encode(hexstring2ab(datas));
}

function sha256(data: string) {
  const hex = cryptoJS.enc.Hex.parse(data);
  const sha = cryptoJS.SHA256(hex).toString();
  return sha;
}

function hexstring2ab(str: string): number[] {
  const result = [];

  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }

  return result;
}

function ab2hexstring(arr: any): string {
  let result: string = '';
  const uint8Arr: Uint8Array = new Uint8Array(arr);
  for (let i = 0; i < uint8Arr.byteLength; i++) {
    let str = uint8Arr[i].toString(16);
    str = str.length === 0 ? '00' : str.length === 1 ? '0' + str : str;
    result += str;
  }
  return result;
}

function ab2str(buf: ArrayBuffer | number[]): string {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

export function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
