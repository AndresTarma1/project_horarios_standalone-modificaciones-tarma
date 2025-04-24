import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { appConfig } from '../../app.config';
import { Profesor } from '../../interfaces/profesor.interface';
import { Estudiante } from '../../interfaces/estudiante.interface';
import { Coordinador } from '../../interfaces/coordinador.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl = environment.apiUrl;

  private http: HttpClient = inject(HttpClient);
  constructor() { }

  getProfesores(): Observable<any>{
    return this.http.get(`${this.apiUrl}/teacher`);
  }

  getEstudiantes(): Observable<any>{
    return this.http.get(`${this.apiUrl}/student`)
  }

  getCoordinadores(): Observable<any>{
    return this.http.get(`${this.apiUrl}/coordinator`);
  }

  postProfesor(profesor: Profesor): Observable<any>{
    return this.http.post(`${this.apiUrl}/teacher`, profesor);
  }

  postEstudiante(estudiante: Estudiante): Observable<any>{
    return this.http.post(`${this.apiUrl}/student`, estudiante);
  }

  postCoordinador(coordinador: Coordinador): Observable<any>{
    return this.http.post(`${this.apiUrl}/coordinator`, coordinador);
  }

  patchProfesor(profesor: Profesor): Observable<any>{
    return this.http.patch(`${this.apiUrl}/teacher/${profesor.id}`, profesor);
  }

  patchEstudiante(estudiante: Estudiante): Observable<any>{
    return this.http.patch(`${this.apiUrl}/student/${estudiante.id}`, estudiante);
  }

  patchCoordinador(coordinador: Coordinador): Observable<any>{
    return this.http.patch(`${this.apiUrl}/coordinator/${coordinador.id}`, coordinador);
  }

  putMe(admin: any): Observable<any>{
    return this.http.patch(`${this.apiUrl}/admin/${admin.id}`, admin);
  }

  deleteProfesor(id: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/teacher/${id}`);
  }

  deleteEstudiante(id: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/student/${id}`);
  }

  deleteCoordinador(id: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/coordinator/${id}`);
  }


}
