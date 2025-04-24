import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoordinadorService } from '../../../../../core/services/coordinador.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { reportUnhandledError } from 'rxjs/internal/util/reportUnhandledError';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-materias-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asignar-materias-modal.component.html',
  styleUrl: './asignar-materias-modal.component.css'
})
export class AsignarMateriasModalComponent implements OnInit{

  @Input() cargaAcademica: any;
  asignaturas: any = [];
  selectedAsignatura: number | null = null;
  mostrarCrearNueva = false;
  nuevaAsignatura = { name: '', description: '', hours_week: ''};


  constructor(private coordinadorService: CoordinadorService, private activateModal: NgbActiveModal){

  }

  ngOnInit(): void {
    this.obtenerAsignaturas()
  }

  obtenerAsignaturas(){
    this.coordinadorService.getAsignaturas().subscribe(
      (res: any) => {
        if(!res.subjects){
          this.asignaturas = [];
        }else{
          this.asignaturas = res.subjects;
        }
      }
    );
  }

  toggleCrearNueva() {
    this.mostrarCrearNueva = !this.mostrarCrearNueva;
  }

  agregarAsignaturaExistente() {
    let datos: any = {};
    datos.id_subject = this.selectedAsignatura;
    datos.carga = this.cargaAcademica;
    this.activateModal.close(datos);
  }

  verificarDatosAsignador(): boolean{
    return this.nuevaAsignatura.name.length > 0 && this.nuevaAsignatura.description.length > 0
  }

  crearYAgregarAsignatura() {
    this.coordinadorService.postAsignatura(this.nuevaAsignatura).subscribe(
      (res: any) => {
        if(res.ok){
          Swal.fire({
            title: 'Exito',
            text: 'Asignatura creada correctamente',
            icon: 'success'
          }).then(
            () => {
              let datos: any = {};
              datos.carga = this.cargaAcademica;
              datos.id_subject = res.materia.id;
              this.activateModal.close(datos);
            }
          );
        }else{
          Swal.fire({
            title: 'Error',
            text: 'Ah ocurrido un error al intentar crear la asignatura',
            icon: 'error'
          }).then(
            () => {this.activateModal.close();}
          )
        }
      }
    )
  }

  closeModal() {
    this.activateModal.close();
  }

}
