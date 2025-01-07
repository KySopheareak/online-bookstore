import { Injectable } from '@angular/core';
import { LocalStorageEnum } from '../models/enums/local-storage.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  get(key: LocalStorageEnum | string): string {
    let value: any = localStorage.getItem(key);
    return value ? value : '';
  }

  set(key: LocalStorageEnum | string, value: string) {
    localStorage.setItem(key, value);
  }

  setJSON(key: LocalStorageEnum | string, value: any): number {
    try {
      this.set(key, JSON.stringify(value));
      return 1;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  getJSON<T>(key: LocalStorageEnum | string): T {
    const value = localStorage.getItem(key);
    return JSON.parse(value as string) as T;
  }

  setArray(key: LocalStorageEnum | string, values: any[]) {
    const value = values.toString();
    this.setEncryption(key, value);
  }

  getArray(key: LocalStorageEnum | string): any {
    const value = this.getDecryption(key);
    return value ? value.split(',') : null;
  }

  delete(key: LocalStorageEnum | string) {
    localStorage.removeItem(key);
  }

  setEncryption(key: string, value: string) {
    const prefix = btoa(key).replace(/=/g, '');
    const base64 = btoa(value);
    localStorage.setItem(key, btoa(prefix + base64));
  }

  getDecryption(key: string) {
    const prefix = btoa(key).replace(/=/g, '');
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    try {
      const base64 = atob(item).replace(prefix, '');
      return atob(base64);
    } catch (error) {
      return null;
    }
  }

  encryptSpecialCharacter(key: LocalStorageEnum | string, value: string) {
    const prefix = btoa(unescape(encodeURIComponent(key))).replace(/=/g, '');
    const base64 = btoa(unescape(encodeURIComponent(value)));
    localStorage.setItem(key, btoa(prefix + base64));
  }

  decryptSpecialCharacter(key: LocalStorageEnum | string) {
    const prefix = btoa(unescape(encodeURIComponent(key))).replace(/=/g, '');
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    try {
      const base64 = decodeURIComponent(escape(window.atob(item))).replace(prefix, '');
      return decodeURIComponent(escape(window.atob(base64)));
    } catch (error) {
      return null;
    }
  }
}
