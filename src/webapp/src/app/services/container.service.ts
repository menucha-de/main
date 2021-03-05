import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { App } from '../models/app';
import { Credentials } from '../models/credentials';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject$

  private baseUrl = '/market/rest';
  constructor(private http: HttpClient) { }

  getAvailable(): Observable<App[]> {
    return this.http.get<App[]>(`${this.baseUrl}/apps/system`);
  }

  getInstalled(): Observable<App[]> {
    return this.http.get<App[]>(`${this.baseUrl}/apps/system/installed`);
  }

  getUpdates(credentials: Credentials): Observable<App[]> {
    if (credentials != null && credentials.user != null && credentials.pass != null){
      return this.http.get<App[]>(`${this.baseUrl}/apps/system/updates`, {
        headers: { 'username': credentials.user, 'password': credentials.pass }
      });
    } else {
      return this.http.get<App[]>(`${this.baseUrl}/apps/system/updates`);
    }
  }

  installApp(namespace: string, app: App): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/apps/${namespace}`, app);
  }

  updateApp(namespace: string, name: string, app: App): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/apps/${namespace}/${name}`, app);
  }

  getAppPage(url: string) {
    return this.http.head(url, { observe: 'response' });
  }
}
