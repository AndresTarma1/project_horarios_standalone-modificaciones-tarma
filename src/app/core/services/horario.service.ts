import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  apiUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  constructor() { }

  getHorarioCargaAcademica(id_academic_load: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/academic_load/${id_academic_load}/schedule`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
  }

  getHorarioMaestro(id_teacher: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/teacher/show-schedule/${id_teacher}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
  }

  getHorarioGrupo(id_grupo: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schedule/${id_grupo}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
  }
}
