import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CoordinadorService } from '../../../../core/services/coordinador.service';
import { map, Observable } from 'rxjs';
import { Estudiante } from '../../../../interfaces/estudiante.interface';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-add-student-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-add-student-group.component.html',
  styleUrl: './modal-add-student-group.component.css',
})
export class ModalAddStudentGroupComponent implements OnInit {

  @Input() grupo: any;
  private coordinadorService: CoordinadorService = inject(CoordinadorService);
  estudiantesNoGrupo$: Observable<any>;
  cambios: boolean = false;

  activeModal = inject(NgbActiveModal);
  constructor() {}

  ngOnInit(): void {
    this.obtenerEstudiantesSinGrupo()
  }

  obtenerEstudiantesSinGrupo(){
    this.estudiantesNoGrupo$ = this.coordinadorService.getEstudiantesSinGrupo();
  }

  addEstudianteGrupo(id_estudiante: string){
    let credenctials = {
      id_group: this.grupo.id,
      id_student: id_estudiante
    };
    this.coordinadorService.patchGrupoEstudiante(credenctials).subscribe(
      (res: any) => {
        if(res.ok){
          Swal.fire({
            title: 'Exito',
            text: 'Añadido con exito',
            icon: 'success'
          })
          this.obtenerEstudiantesSinGrupo();
          this.cambios = true;
        }else{
          Swal.fire({
            title: 'Error',
            text: 'Ah ocurrido un error al intentar agregar al estudiante' + res.msg,
            icon: 'error'
          })
        }
      }
    )
  }
}
