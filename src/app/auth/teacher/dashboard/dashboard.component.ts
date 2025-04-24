import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TeacherService } from '../../../core/services/teacher.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  horario$: Observable<any>;

  profesor: any;

  constructor(private teacherService: TeacherService){
    this.profesor = JSON.parse(localStorage.getItem('profesor')!);
  }

  ngOnInit(): void {
    this.buscarHorario();
  }

  buscarHorario(){

    this.horario$ = this.teacherService.getHorario(this.profesor.id).pipe(
      map((res: any) => {
        if(res.horario){
          const horarioDelDia = res.horario.find((h: any) => h.dia === this.obtenerDiaActual());
          res.horario = horarioDelDia ? horarioDelDia.clases : [];
          return res;
        }else{
          res.horario = [];
        }
        return res;
      })
    )
  };

  obtenerDiaActual(): string {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diaIndice = new Date().getDay();
    return dias[diaIndice];
  }

}
