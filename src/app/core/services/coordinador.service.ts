import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  map,
  catchError,
  of,
  Observable,
  timer,
  switchMap,
  interval,
  retry,
} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { appConfig } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class CoordinadorService {
  constructor() { }

  private http: HttpClient = inject(HttpClient);

  apiURL: string = environment.apiUrl;

  getEstudiantesSinGrupo(): Observable<any> {
    return this.http.get(`${this.apiURL}/student/not-group`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getCarreras(): Observable<any> {
    return this.http.get(`${this.apiURL}/careers`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getProfesoresConCargaAcademica(id_subject: number): Observable<any> {
    return this.http.get(
      `${this.apiURL}/subject/show-teachers-academicLoads/${id_subject}`, { headers: { 'ngrok-skip-browser-warning': 'true' } }
    )
  }

  getCargasAcademicasCarrera(id_carrera: number) {
    return this.http.get(
      `${this.apiURL}/academic_load/ver-con-carrera/${id_carrera}`,
      { headers: { 'ngrok-skip-browser-warning': 'true' } }
    );
  }

  getProfesores(): Observable<any> {
    return this.http.get(`${this.apiURL}/teacher`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getAsignaturas(): Observable<any> {
    return this.http.get(`${this.apiURL}/subject`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getCarrera(carrera_id: string): Observable<any> {
    return this.http.get(`${this.apiURL}/careers/${carrera_id}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getCargaAcademicas(): Observable<any> {
    return this.http.get(`${this.apiURL}/academic_load`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getAsignaturasCargaAcademica(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/academic_load/${id}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getAsignaturasDeProfesor(id_teacher: string): Observable<any> {
    return this.http.get(`${this.apiURL}/teacher/teacher-subject/${id_teacher}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
  }

  getProfesoresAsignatura(id: string): Observable<any> {
    return this.http.get(`${this.apiURL}/subject_teacher/${id}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getGrupos(): Observable<any> {
    return this.http.get(`${this.apiURL}/group`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  postAsignatura(asignatura: any): Observable<any> {
    return this.http.post(`${this.apiURL}/subject`, asignatura, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
  }

  getGruposConEstudiantes(): Observable<any> {
    return this.http.get(`${this.apiURL}/group/with-students`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getEstudiantesDeUnGrupo(id_grupo: number): Observable<any> {
    return this.http.get(`${this.apiURL}/student/group/${id_grupo}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getCarreraDeUnGrupo(): void{
    
  }

  getEstudiantes(): Observable<any> {
    return this.http.get(`${this.apiURL}/student`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
  }

  getHorario(grupoId: any): Observable<any> {
    return this.http.get(`${this.apiURL}/schedule/${grupoId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  getProfesoresDisponibilidad(credenciales: any) {
    return this.http.get(`${this.apiURL}/schedule/ver-dias-horas`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      params: credenciales,
    });
  }

  postAsignaturaMaestro(credenctials: any): Observable<any> {
    const { id_subject, id_teacher } = credenctials;
    return this.http.post(
      `${this.apiURL}/subject_teacher`,
      {},
      {
        params: {
          id_subject: id_subject,
          id_teacher: id_teacher,
        },
      }
    );
  }

  postCarreraConCargas(credentials: any): Observable<any> {
    return this.http.post(`${this.apiURL}/careers/withAcademic`, credentials,
      { headers: { 'ngrok-skip-browser-warning': 'true' } }
    );
  }

  putMe(coordinador: any): Observable<any> {
    return this.http.patch(`${this.apiURL}/coordinator/${coordinador.id}`, coordinador,
      { headers: { 'ngrok-skip-browser-warning': 'true' }
    });
  }


  patchGrupoEstudiante(credentials: any): Observable<any> {
    const { id_group, id_student } = credentials;
    return this.http.patch(
      `${this.apiURL}/student/add-group`,
      credentials, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    }
    );
  }

  postHorario(horario: any): Observable<any> {
    return this.http.post(`${this.apiURL}/schedule`, horario, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  postHorarioManual(horario: any): Observable<any> {
    return this.http.post(`${this.apiURL}/schedule/create-manual`, horario, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  postHorarioAutomatico(horario: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/schedule/create-automatico`,
      horario,
      { headers: { 'ngrok-skip-browser-warning': 'true' } }
    );
  }

  postCargaAcademica(cargaAcademica: any) {
    return this.http.post(
      `${this.apiURL}/academic_load`,
      { name: cargaAcademica.name, id_career: cargaAcademica.id_career },
      { headers: { 'ngrok-skip-browser-warning': 'true' } }
    );
  }

  postAsignaturasCargaAcademica(datos: any) {
    // console.log(cargaAcademica, asignaturas);
    return this.http.post(`${this.apiURL}/academic_load-subject`, {
      id_academic_load: `${datos.carga.id}`,
      id_subject: `${datos.id_subject}`,
    });
  }

  postGrupo(grupo: any) {
    return this.http.post(`${this.apiURL}/group`, grupo,
      { headers: { 'ngrok-skip-browser-warning': 'true' } }
    );
  }

  patchQuitarEstudianteDeGrupo(id_student: string): Observable<any> {
    return this.http.patch(
      `${this.apiURL}/student/delete-group/${id_student}`,
      {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      }
    );
  }

  putGrupos(grupo: any): Observable<any> {
    return this.http.put(`${this.apiURL}/group/${grupo.id}`, grupo, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  putCargaAcademica(cargaAcademica: any): Observable<any> {
    return this.http.put(`${this.apiURL}/academic_load/${cargaAcademica.id}`, cargaAcademica, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
  }

  putCarrera(carrera: any): Observable<any> {
    return this.http.put(`${this.apiURL}/careers/${carrera.id}`, carrera,
      {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
  }

  putAsignatura(asignatura: any): Observable<any> {
    return this.http.put(`${this.apiURL}/subject/${asignatura.id}`, asignatura, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  deleteGrupo(id_grupo: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/group/${id_grupo}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
  }

  deleteAsignatura(id_subject: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/subject/${id_subject}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
  }

  deleteHorario(horario: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/schedule/${horario}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  deleteHorarioCompleto(id_group: string): Observable<any>{
    return this.http.delete(`${this.apiURL}/group/delete-schedule`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      params: { 'id_group': id_group},
    });
  }

  deleteCarrera(id_carrera: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/careers/${id_carrera}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  deleteCargaAcademica(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/academic_load/${id}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
  }

  deleteAsignaturaDeProfesor(credenciales: any): Observable<any> {
    return this.http.delete(`${this.apiURL}/subject_teacher`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      body: credenciales
    })
  }

  deleteAsignaturaCargaAcademica(credenciales: any): Observable<any> {
    return this.http.delete(`${this.apiURL}/academic_load-subject/`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      body: credenciales
    })
  }
}
