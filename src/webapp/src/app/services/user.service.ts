import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Password } from '../models/password';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo() {
    return this.http.get<User>('/auth/user/info');
  }

  changePassword(password: string) {
    return this.http.put('/auth/user/password', { newPassword: password } as Password);
  }

  get passwordChanged() {
    return sessionStorage.getItem('passChanged') === 'true';
  }

  set passwordChanged(value: boolean) {
    sessionStorage.setItem('passChanged', "" + value);
  }
}
