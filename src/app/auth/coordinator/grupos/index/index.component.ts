import { Component, inject, Input } from '@angular/core';
import {
  NgbAccordionModule,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { catchError, delay, map, Observable, retry, retryWhen, takeWhile } from 'rxjs';
import { CoordinadorService } from '../../../../core/services/coordinador.service';
import { CommonModule } from '@angular/common';
import { ErrorServidorComponent } from '../../../../components/error-servidor/error-servidor.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { StudentsListGroupComponent } from '../students-list-group/students-list-group.component';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditGroupModalComponent } from '../edit-group-modal/edit-group-modal.component';
import { ModalAddStudentGroupComponent } from '../modal-add-student-group/modal-add-student-group.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    FormsModule,
    NgbAccordionModule,
    CommonModule,
    ErrorServidorComponent,
    NgxPaginationModule
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {

  private coordinadorService: CoordinadorService = inject(CoordinadorService);
  public grupos$: Observable<any>;
  public EstudiantesPorGrupo$: Observable<any>;


  filtroInput: string = '';
  gruposFiltrados$: Observable<any>;
  filtrarGrupos(){

    if (this.filtroInput.length > 0) {
      this.gruposFiltrados$ = this.grupos$;

      this.grupos$ = this.gruposFiltrados$.pipe(
        map((res: any) =>
          {
            res.groups = res.groups.filter((group: any) => {
              if(group.name.toLowerCase().includes(this.filtroInput.toLowerCase())){
                return group;
              }
            
            }

          )
          return res;
        }
        )
      );
    } else {
      // Si no hay filtro, mostramos todas las asignaturas
      this.grupos$ = this.gruposFiltrados$;
    }

  }
  error = false;

  p: number = 1;

  selectedGrupo: {id: number | null, name?: string} = {id: null};

  constructor(
    private modalService: NgbModal
  ) {}

  addEstudianteGrupo(): void {
    if(this.selectedGrupo.id){
      const modalRef = this.modalService.open(ModalAddStudentGroupComponent);
      modalRef.componentInstance.grupo = this.selectedGrupo;
      modalRef.closed.subscribe((res: any) => {
        if(res){
          this.obtenerEstudiantesPorGrupo();
        }
      });
    }
  }

  grupoSeleccionada(grupo: any): void{

    if(grupo.id == this.selectedGrupo.id){
      this.selectedGrupo = {id: null};
      return;
    }else{
      this.selectedGrupo.id = grupo.id;
      this.selectedGrupo.name = grupo.name;
      this.obtenerEstudiantesPorGrupo();
    }

  }

  ngOnInit(): void {
    this.obtenerGrupos();
  }

  obtenerGrupos(): void {
    this.grupos$ = this.coordinadorService.getGrupos().pipe(
      retry({delay: 5000}),
      catchError((err) => {
        this.error = true;
        throw new Error('Ah ocurrido un error en el servidor');
      })
    );
  }


  total(grupoInfo: any): number {
    return grupoInfo.groups.length;
  }

  obtenerCambios(grupo: any) {
    this.coordinadorService.putGrupos(grupo).subscribe((res: any) => {
      if (res.ok) {
        Swal.fire({
          title: 'Exito',
          text: `El grupo ${grupo.name} ha sido editado correctamente`,
          icon: 'success',
        }).then(() => {
          this.obtenerEstudiantesPorGrupo();
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: `El grupo ${grupo.name} no se ha podido editar`,
          icon: 'error',
        });
      }
    });
  }

  editarGrupo(grupo: any): void
  {
    const modalRef = this.modalService.open(EditGroupModalComponent);

    modalRef.componentInstance.grupo = {...grupo};

    modalRef.componentInstance.save.subscribe((grupo: any) => {

      if(grupo.cambios){
        this.obtenerCambios(grupo);
      }
    });

    modalRef.componentInstance.delete.subscribe((grupo: any) => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar el grupo "${grupo.name}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.eliminarGrupo(grupo);
        }
      });
    });

  }

  eliminarGrupo(grupo: any) {
    this.coordinadorService.deleteGrupo(grupo.id).subscribe((res: any) => {
      if (res.ok) {
        Swal.fire({
          title: 'Exito',
          text: `El grupo ${grupo.name} sido eliminado correctamente`,
          icon: 'success',
        }).then(() => {
          this.selectedGrupo = {id: null};
          this.obtenerEstudiantesPorGrupo();
          this.obtenerGrupos();
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: `El grupo no se ha podido eliminar`,
          icon: 'error',
        });
      }
    });
  }

  obtenerEstudiantesPorGrupo() {
    if (this.selectedGrupo.id){
      this.EstudiantesPorGrupo$ = this.coordinadorService
       .getEstudiantesDeUnGrupo(this.selectedGrupo.id)
       .pipe(
          map((response: any) => {
            if(!response.ok){
              response.students = [];
            }
            return response;
          }),
          retry({delay: 5000}),
          catchError((err) => {
            this.error = true;
            throw new Error('Ah ocurrido un error en el servidor');
          })
        );
    }
  }

  eliminarEstudianteDelGrupo(estudiante: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al estudiante ${estudiante.name} del grupo?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma la eliminación
        this.coordinadorService
          .patchQuitarEstudianteDeGrupo(estudiante.id)
          .subscribe((res: any) => {
            if (res.ok) {
              Swal.fire({
                title: 'Degradación correcta',
                text: `El estudiante ${estudiante.name} ha sido quitado del grupo exitosamente.`,
                icon: 'success',
              }).then(() => {
                this.obtenerEstudiantesPorGrupo(); // Actualizar la lista de estudiantes
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: `El estudiante ${estudiante.name} no se ha logrado quitar del grupo.`,
                icon: 'error',
              });
            }
          });
      }
    });
  }


  crearGrupo() {
    const modalRef = this.modalService.open(CreateGroupComponent);
    modalRef.closed.subscribe((grupo: any) => {
      if (grupo != undefined) {
        this.coordinadorService.postGrupo(grupo).subscribe((res: any) => {
          if (res.ok) {
            Swal.fire({
              title: 'Exito',
              text: `El grupo ${grupo.name} se ha añadido correctamente`,
              icon: 'success',
            }).then(() => {
              this.obtenerEstudiantesPorGrupo();
              this.obtenerGrupos()
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: `El grupo no se ha podido crear`,
              icon: 'error',
            });
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-modal-create-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Crear Grupo</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      ></button>
    </div>
    <form [formGroup]="formGrupo">
      <div class="modal-body">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre del grupo:</label>
          <input
            type="text"
            class="form-control"
            id="nombre"
            formControlName="name"
          />
          @if(formGrupo.get('name')!.invalid && formGrupo.get('name')!.touched){
          <div class="text-danger">El nombre es requerido.</div>
          }
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          [disabled]="formGrupo.invalid"
          class="btn btn-outline-primary me-2"
          (click)="activeModal.close(formGrupo.value)"
        >
          Crear Grupo
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary"
          (click)="activeModal.close('Close click')"
        >
          Cerrar
        </button>
      </div>
    </form>
  `,
  styles: '',
})
export class CreateGroupComponent {
  activeModal = inject(NgbActiveModal);

  formGrupo: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGrupo = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }
}
