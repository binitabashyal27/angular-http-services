import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
  cOllegeId: number;
  uniId: number;
  isUgc: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl:string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  login(
    email: string,
    password: string
  ): Observable<any> {

    const loginData: LoginRequest = {
      email: email,
      password: password,
      cOllegeId: 12,
      uniId: 0,
      isUgc: false
    };

    return this.http.post(
      `${this.apiUrl}/api/User/Login`,
      loginData
    );
  }
}