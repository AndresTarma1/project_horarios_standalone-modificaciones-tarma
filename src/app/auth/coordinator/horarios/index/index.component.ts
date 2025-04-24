import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CoordinadorService } from '../../../../core/services/coordinador.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../../../core/services/horario.service';
import { ScheduleComponent } from '../../../../components/schedule/schedule.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule,ScheduleComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {

  public grupos$: Observable<any>;
  public profesores$: Observable<any>;
  public carreras$: Observable<any>;
  public horario$: Observable<any>;

  buscarPor: number = 0;
  id_search: string = '';
  opcion: boolean = false;

  label_search: string[] = ['Carga Académica','Maestro', 'Grupo']

  private coordinadorService: CoordinadorService = inject(CoordinadorService);
  private horarioService: HorarioService = inject(HorarioService);


  buscarOpciones(): void{
    this.horario$ = new BehaviorSubject(null);
    this.id_search = '';
    if(this.buscarPor == 0){
      return;
    }else{
      switch(this.buscarPor){
        case 2:
          this.opcion = false;
          this.profesores$ = this.coordinadorService.getProfesores().pipe(
            map((res: any) => {
              if(!res.teachers){
                res.teachers = [];
              }
              return res;
            })
          );

          break;
        case 3:
          this.opcion = true;
          this.grupos$ = this.coordinadorService.getGrupos().pipe(
            map((res: any) => {
              if(!res.groups){
                res.groups = [];
              }
              return res;
            })
          );
        break;

        default:
          break;
      }
    }
  }

  constructor() {
  }

  ngOnInit(): void {}

  habilitarButton(): boolean{
    if(this.buscarPor != 0 && this.id_search != ''){
      return false;
    }
    else{
      return true;
    }
  }

  maestro: boolean = false;
  buscarHorario(): void{

    if(this.buscarPor && this.id_search){

      switch(this.buscarPor){
        case 2:
          this.maestro = true;
          this.horario$ = this.horarioService.getHorarioMaestro(this.id_search.toString()).pipe(
            map( (res: any) => {
              if(!res.ok){
                Swal.fire({
                  title: 'Error',
                  text: `${res.msg}`,
                  icon: 'error',
                }).then(() => { this.horario$ = new BehaviorSubject(null);});
              }
              return res;
            })
          );
          break;

        case 3:
        this.maestro = false;
        this.horario$ = this.horarioService.getHorarioGrupo(parseInt(this.id_search)).pipe(
          map( (res: any) => {
            if(!res.ok){
              Swal.fire({
                title: 'Error',
                text: 'El grupo no contiene horarios',
                icon: 'error',
              }).then(() => { this.horario$ = new BehaviorSubject(null);});
            }
            return res;
          })
        );
        break;
      }
    }else{
      this.horario$ = new BehaviorSubject(null);
    }
  }

  verificarSearch(){
    this.horario$ = new BehaviorSubject(null);
  }

  borrarHorario(){
    if (this.id_search) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás deshacer esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.coordinadorService.deleteHorarioCompleto(this.id_search).subscribe(
            (res: any) => {
              if (res.ok) {
                Swal.fire({
                  title: 'Éxito',
                  text: 'El horario ha sido eliminado',
                  icon: 'success',
                }).then(() => {
                  this.buscarHorario();
                });
              }
            },
            (error) => {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el horario',
                icon: 'error',
              });
            }
          );
        }
      });
    }

  }

}
