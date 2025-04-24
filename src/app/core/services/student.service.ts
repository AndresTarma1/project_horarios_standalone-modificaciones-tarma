import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  urlAPI : string = environment.apiUrl;

  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getGrupo(id_student: string): Observable<any>{
    return this.http.get(`${this.urlAPI}/student/show-group/${id_student}`,
       { headers: {'ngrok-skip-browser-warning':'true'}
    });
  }

  patchMe(student: any): Observable<any>{
    return this.http.patch(`${this.urlAPI}/student/${student.id}`,
      student,
      { headers: {'ngrok-skip-browser-warning':'true'}
    });
  }

  getHorario(id: string): Observable<any>{
    return this.http.get(`${this.urlAPI}/student/show-schedule/${id}`, { headers: {'ngrok-skip-browser-warning':'true'} });
  }
}
