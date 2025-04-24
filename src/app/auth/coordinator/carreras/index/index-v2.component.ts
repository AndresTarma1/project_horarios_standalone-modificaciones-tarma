import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CoordinadorService } from '../../../../core/services/coordinador.service';
import { CommonModule } from '@angular/common';
import { CargasAcademicasModalComponent } from './cargas-academicas-modal/cargas-academicas-modal.component';
import Swal from 'sweetalert2';
import { AsignarMateriasModalComponent } from './asignar-materias-modal/asignar-materias-modal.component';
import { EditCareerModalComponent } from './edit-career-modal/edit-career-modal.component';
import { EditCargaModalComponent } from './edit-carga-modal/edit-carga-modal.component';

@Component({
  selector: 'app-index-v2',
  standalone: true,
  imports: [NgbAccordionModule, NgxPaginationModule, CommonModule],
  templateUrl: './index-v2.component.html',
  styleUrl: './index-v2.component.css'
})
export class IndexV2Component implements OnInit {

  carreras$: Observable<any>;
  cargasAcademicas$: Observable<any>;
  selectedCarrera: { id: number | null , name?: string } = { id: null};

  ngOnInit(): void {
    this.obtenerCarreras();
  }

  constructor(private coordinadorService: CoordinadorService, private modalService: NgbModal){
  }

  obtenerCarreras(): void{
    this.carreras$ = this.coordinadorService.getCarreras();
  }

  carreraSeleccionada(carrera: any): void{

    if(carrera.id === this.selectedCarrera.id){
      this.selectedCarrera = {id: null};
      return;
    }

    this.selectedCarrera.id = carrera.id;
    this.selectedCarrera.name = carrera.name;
    this.buscarCargasAcademicas();
  }

  buscarCargasAcademicas(): void{
    this.cargasAcademicas$ = this.coordinadorService.getCargasAcademicasCarrera(this.selectedCarrera.id!).pipe(
      map ( (res: any) => {
        if(res.cargas){
          res.cargas.forEach((element: any) => {
            this.coordinadorService.getAsignaturasCargaAcademica(element.id).subscribe(
              (res_v2: any) => {
                element.asignaturas = res_v2.subjects
              }
            );
          });
        }else{
          res.cargas = [];
        }
        return res;
      })
    );
  }

  openAddCargaAcademica(): void{
    const modalref = this.modalService.open(CargasAcademicasModalComponent);
    modalref.componentInstance.carrera = this.selectedCarrera;
    modalref.closed.subscribe( (res: any) => {
      if(res != undefined){
        this.addCargaAcademica(res);
      }
    });
  }

  addCargaAcademica(credenciales: any): void{
    this.coordinadorService.postCargaAcademica(credenciales).subscribe(
      (res: any) => {
        if(res.ok){
          Swal.fire({
            title: 'Exito',
            text: 'Carga academica creada con exito',
            icon: 'success'
          }).then( () => {
            this.buscarCargasAcademicas();
          });
        }else{
          Swal.fire({
            title: 'Error',
            text: 'La carga academica no se ha podido crear',
            icon: 'warning'
          });
        }
      }
    );
  }

  openModalAsignatura(cargaAcademica: any): void{
    const modalref = this.modalService.open(AsignarMateriasModalComponent);
    modalref.componentInstance.cargaAcademica = cargaAcademica;
    modalref.closed.subscribe( (res: any) => {
      if(res != undefined){
        this.addAsignatura(res);
      }
    })
  }

  addAsignatura(datos: any): void{
    this.coordinadorService.postAsignaturasCargaAcademica(datos).subscribe(
      (res: any) => {
        if(res.ok){
          Swal.fire({
            title: 'Exito',
            text: 'Asignatura creada con exito',
            icon: 'success'
          }).then( () => {
            this.buscarCargasAcademicas();
          });
        }else{
          Swal.fire({
            title: 'Error',
            text: 'No se ha podido añadir la asignatura',
            icon: 'warning'
          });
        }
      }
    )
  }

  deleteAsignatura(cargaAcademica: any, asignatura: any): void{
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará ${asignatura.name} de la carga academica ${cargaAcademica.name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        let credenciales: any = {};
        credenciales.id_subject = asignatura.id;
        credenciales.id_academic_load = cargaAcademica.id;
        this.coordinadorService.deleteAsignaturaCargaAcademica(credenciales).subscribe(
          (res: any) => {
            if(res.ok){
              Swal.fire({
                title: 'Exito',
                text: 'La asignatura fue eliminada con exito de la carga academica',
                icon: 'success'
              }).then(
                () => {
                  this.buscarCargasAcademicas();
                }
              )
            }else{
              Swal.fire({
                title: 'Error',
                text: 'La asignatura no se ha podido eliminar de la carga academica',
                icon: 'error'
              });
            }
          }
        );
      }
    });

  }

  editarCarrera(carrera: any): void{

    const modalref = this.modalService.open(EditCareerModalComponent);
    modalref.componentInstance.carrera = {...carrera};

    modalref.componentInstance.save.subscribe( (carrera: any) =>
      {
        this.coordinadorService.putCarrera(carrera).subscribe(
          (res: any) => {
            if(res.ok){
              Swal.fire({
                title: 'Exito',
                text: 'La carrera fue editada con exito',
                icon:'success'
              }).then(
                () => {
                  this.obtenerCarreras();
                }
              )
            }else{
              Swal.fire({
                title: 'Error',
                text: 'La carrera no se ha podido editar',
                icon: 'error'
              });
            }
          }
        );
      }
    );


    modalref.componentInstance.delete.subscribe( (carrera: any) =>
    {
      Swal.fire({
        title: '¿Estas seguro?',
        text: `Esta acción eliminará ${carrera.name}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then( (result) => {
        if(result.isConfirmed){
          this.coordinadorService.deleteCarrera(carrera.id).subscribe(
            (res: any) => {
              if (res.ok) {
                Swal.fire(
                  'Eliminado!',
                  `${carrera.name} ha sido eliminada.`,
                  'success'
                );

                this.obtenerCarreras();
                this.cargasAcademicas$ = new BehaviorSubject(null);
                this.selectedCarrera = { id: null};
              } else {
                // Si no fue exitoso, mostrar un mensaje de error
                Swal.fire(
                  'Error!',
                  'Hubo un problema al eliminar la carrera.',
                  'error'
                );
              }
            }
          )
        }
      });

    })
  }

  editarCargaAcademica(cargaAcademica: any): void
  {
    const modalref = this.modalService.open(EditCargaModalComponent);
    modalref.componentInstance.cargaAcademica = {...cargaAcademica};

    modalref.componentInstance.save.subscribe( (cargaAcademica: any) => {
      cargaAcademica.id_career = this.selectedCarrera.id;
      this.coordinadorService.putCargaAcademica(cargaAcademica).subscribe(
        (res: any) => {
          if(res.ok){
            Swal.fire({
              title: 'Exito',
              text: 'La carga academica fue editada con exito',
              icon:'success'
            }).then(
              () => {
                this.buscarCargasAcademicas();
              }
            )
          }else{
            Swal.fire({
              title: 'Error',
              text: 'La carga academica no se ha podido editar',
              icon: 'error'
            });
          }
        }
      );
    });

    modalref.componentInstance.delete.subscribe( (cargaAcademica: any) => {
      Swal.fire({
        title: '¿Estas seguro?',
        text: `Esta acción eliminará ${cargaAcademica.name}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then( (result) => {
        if(result.isConfirmed){
          this.coordinadorService.deleteCargaAcademica(cargaAcademica.id).subscribe(
            (res: any) => {
              if (res.ok) {
                Swal.fire(
                  'Eliminado!',
                  `${cargaAcademica.name} ha sido eliminada.`,
                 'success'
                ).then( () => this.buscarCargasAcademicas());
              }else{
                Swal.fire({
                  title: 'Error!',
                  text: 'Hubo un problema al eliminar la carga academica.',
                  icon: 'error'
                });
              }
            }
          )
        }
      })
    })

  }

}
