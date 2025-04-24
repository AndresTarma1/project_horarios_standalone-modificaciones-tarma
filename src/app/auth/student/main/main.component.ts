import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StudentService } from '../../../core/services/student.service';
import { InitEditableRow } from 'primeng/table';
import { map, Observable } from 'rxjs';

interface Task {
  id: number;
  description: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  grupo: string = '';
  estudianteService: StudentService = inject(StudentService);
  $horario: Observable<any>;

  estudiante:any = {};

  ngOnInit(): void {
    this.estudiante = JSON.parse(localStorage.getItem('estudiante')!);
    this.buscarHorarioHoy();
    this.buscarGrupo();
  }

  buscarGrupo(){
    this.estudianteService.getGrupo(this.estudiante.id).subscribe(
      (res: any) => {
        if(res.ok){
          this.grupo = res.group.name;
        }else{
          this.grupo = 'No tiene grupo';
        }
      });
  }

  buscarHorarioHoy(){
    this.$horario = this.estudianteService.getHorario(this.estudiante.id).pipe(
      (map((res: any) => {

        if(res.horario){
          const horarioDelDia = res.horario.find((h: any) => h.dia === this.obtenerDiaActual());
          console.log(horarioDelDia);

          res.horario = horarioDelDia ? horarioDelDia.clases : [];
          return res;
        }else{
          res.horario = [];
        }

        return res;
      }))
    );
  }


  obtenerDiaActual(): string {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diaIndice = new Date().getDay();
    return dias[diaIndice];
  }
}
