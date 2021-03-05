import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SysInfo } from '../models/sysinfo';

export type State = 'Reboot' | 'PowerOff';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private http: HttpClient) { }

  getInfo() {
    return this.http.get<SysInfo>('/sysinfo');
  }

  setState(state: State) {
    return this.http.put('/system/rest/system/state', state)
  }
}
