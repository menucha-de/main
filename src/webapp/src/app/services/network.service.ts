import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Interface } from '../models/interface';
import { Proxy } from '../models/proxy';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private http: HttpClient) { }

  getNetworkDetails() {
    return this.http.get<Interface[]>('/system/rest/network/interfaces');
  }
  getNetworkInterface(name: string) {
    return this.http.get<Interface>(`/system/rest/network/interfaces/${name}`);
  }
  setNetworkInterface(name: string, data: Interface) {
    return this.http.put(`/system/rest/network/interfaces/${name}`, data);
  }
  getDateTimeInfo() {
    return this.http.get('/system/rest/datetime/info');
  }
  getDateTime() {
    return this.http.get('/system/rest/datetime/datetime');
  }
  setNTP(val: boolean) {
    return this.http.put('/system/rest/datetime/ntp', val);
  }
  setTimezone(val: string) {
    return this.http.put('/system/rest/datetime/timezone', val);
  }
  setDateTime(val: string) {
    return this.http.put('/system/rest/datetime/datetime', val);
  }
  setntpServer(val: string) {
    if (val === '') {
      return this.http.delete('/system/rest/datetime/ntpserver');
    } else {

      return this.http.put('/system/rest/datetime/ntpserver', val);
    }
  }

  getProxyConfig() {
    return this.http.get<Proxy>('/system/rest/proxy');
  }

  setProxyConfig(value: Proxy) {
    return this.http.put('/system/rest/proxy', value);
  }
}
