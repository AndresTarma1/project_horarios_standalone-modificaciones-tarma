import { Component, EventEmitter, inject, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Estudiante } from '../../../../interfaces/estudiante.interface';
import { CoordinadorService } from '../../../../core/services/coordinador.service';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalAddStudentGroupComponent } from '../modal-add-student-group/modal-add-student-group.component';

@Component({
  selector: 'app-students-list-group',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPopoverModule, ],
  templateUrl: './students-list-group.component.html',
  styleUrl: './students-list-group.component.css',
})
export class StudentsListGroupComponent implements OnInit, OnChanges {

  private modalService = inject(NgbModal);

  addEstudiantesGrupo(): void{
    const modalRef = this.modalService.open(ModalAddStudentGroupComponent);
    modalRef.componentInstance.grupo =  this.grupo;

    modalRef.result.then(
      (resultado: any) => {
        if(resultado){
          this.cambios.emit(true);
        }
      }
    )
  }

  @Output() cambios: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() grupo: any;

  coordinadorService: CoordinadorService = inject(CoordinadorService);
  unFiltro: Estudiante[];
  inputFiltro: string = '';
  @Output() quitarGrupo: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.grupo = changes['grupo'].currentValue;
    this.completarNombres();
  }

  ngOnInit(): void {
    this.completarNombres();
  }

  completarNombres(): void{
    if (this.grupo.estudiantes) {
      this.grupo.estudiantes.forEach((estudiante: Estudiante) => {
      });
      this.unFiltro = [...this.grupo.estudiantes];
    }
  }

  buscarFiltro() {
    if (this.inputFiltro) {
      this.grupo.estudiantes = this.unFiltro.filter((estudiantes: Estudiante) => {
        return estudiantes.name.includes(this.inputFiltro.toLowerCase());
      });
    } else {
      this.grupo.estudiantes = this.unFiltro;
    }
  }

  quitarGrupoEstudiante(estudiante: any){
    Swal.fire({
      title: 'Seguro?',
      text: `Estas seguro de quitar el grupo al estudiante ${estudiante.name} \n
      de codigo ${estudiante.id}...?`,
      icon: 'warning',
      confirmButtonText: 'Eliminar del grupo',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.quitarGrupo.emit(estudiante);
      }
    });
  }
}
