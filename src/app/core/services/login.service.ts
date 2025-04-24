import { HttpClient } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiURL:string  = environment.apiUrl;

  private http: HttpClient = inject(HttpClient);

  constructor() { }

  loginCoordinador(credenciales: any): Observable<any>{
    return this.http.post(`${this.apiURL}/auth/login-coor`, credenciales, { headers: {'ngrok-skip-browser-warning':'true'} })
  }

  loginEstudiante(credenciales: any): Observable<any>{
    return this.http.post(`${this.apiURL}/auth/login-student`, credenciales,{ headers: {'ngrok-skip-browser-warning':'true'} });
  }

  loginProfesor(credenciales: any): Observable<any>{
    return this.http.post(`${this.apiURL}/auth/login-teacher`, credenciales,{ headers: {'ngrok-skip-browser-warning':'true'} });
  }

  loginAdmin(credenciales: any): Observable<any>{
    return this.http.post(`${this.apiURL}/auth/login-admin`, credenciales);
  }

}
