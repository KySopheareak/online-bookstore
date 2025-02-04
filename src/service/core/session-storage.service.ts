import { Injectable } from '@angular/core';
import { SessionStorage } from '../../models/enums/session-storage.enum';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  save(key: SessionStorage | string, value: string) {
    sessionStorage.setItem(key, value);
  }

  get<T>(key: SessionStorage | string): T {
    return sessionStorage.getItem(key) as unknown as T;
  }

  setJson(key: string, value: any): void {
    this.save(key, JSON.stringify(value));
  }

  getJSON<T>(key: string): T {
    return JSON.parse(this.get(key));
  }

  set(key: string, value: string) {
    const prefix = btoa(key).replace(/=/g, '');
    const base64 = btoa(value);
    sessionStorage.setItem(key, btoa(prefix + base64));
  }

  setArray(key: string, values: any[]) {
    const value = values.toString();
    this.set(key, value);
  }

  setObject(key: string, values: object) {
    const value = JSON.stringify(values);
    this.set(key, value);
  }

  getObject(key: SessionStorage) {
    let value: any = sessionStorage.getItem(key);
    return JSON.parse(value);
  }

  saveObject(key: SessionStorage, obj: any) {
    sessionStorage.setItem(key, JSON.stringify(obj));
  }

  getArray(key: SessionStorage): any {
    const value = this.get<any>(key);
    return value ? value.split(',') : null;
  }

  delete(key: string) {
    sessionStorage.removeItem(key);
  }

  setSpecialCharacter(key: string, value: string) {
    const prefix = btoa(unescape(encodeURIComponent(key))).replace(/=/g, '');
    const base64 = btoa(unescape(encodeURIComponent(value)));
    sessionStorage.setItem(key, btoa(prefix + base64));
  }

  getSpecialCharacter(key: string) {
    const prefix = btoa(unescape(encodeURIComponent(key))).replace(/=/g, '');
    const item = sessionStorage.getItem(key);
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
