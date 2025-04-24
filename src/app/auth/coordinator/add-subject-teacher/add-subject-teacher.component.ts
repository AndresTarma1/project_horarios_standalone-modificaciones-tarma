import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CoordinadorService } from '../../../core/services/coordinador.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-subject-teacher',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbProgressbarModule],
  templateUrl: './add-subject-teacher.component.html',
  styleUrl: './add-subject-teacher.component.css'
})
export class AddSubjectTeacherComponent {

  valor = 0;
  asignaturas$: Observable<any>;
  profesores$: Observable<any>;
  asignaturasMaestro$: Observable<any>;


  asignacionMaterias: FormGroup = this.fb.group({
    'id_teacher': ['', Validators.required],
    'id_subject': ['', Validators.required],
  });

  constructor(private coordinadorService: CoordinadorService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.obtenerMaestros();
  }

  obtenerMaestros(): void{
    this.profesores$ = this.coordinadorService.getProfesores();
  }

  obtenerAsignaturas(): void{
    let id_teacher = this.asignacionMaterias.controls['id_teacher'].value;
    if(id_teacher){
      this.asignaturas$ = this.coordinadorService.getAsignaturas();
      this.asignaturasMaestro$ = this.coordinadorService.getAsignaturasDeProfesor(id_teacher);
    }else{
      this.asignaturas$ = new BehaviorSubject(null);
      this.asignaturasMaestro$ = new BehaviorSubject(null);
    }
  }



  addAsignaturaAMaestro(): void{
    this.coordinadorService.postAsignaturaMaestro(this.asignacionMaterias.value).subscribe({
      next: (res: any) => {
        if(res.ok){
          Swal.fire({
            title: 'Exito',
            text: 'La asignatura se ha establecido exitosamente',
            icon: 'success'
          });
        }else{
          Swal.fire({
            title: 'Error',
            text: 'El profesor no se ha podido asignar a la asignatura, ah ocurrido un error',
            icon: 'error'
          });
        }
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Conflicto',
          text: `El profesor ya esta dando esta asignatura`,
          icon: 'error'
        });
        this.asignacionMaterias.patchValue({
          'id_subject' : ''
        });
      },
      complete: () => {
        this.obtenerAsignaturas();
      }
    })
  }


  eliminarAsignaturaDelMaestro(asignatura: any): void {
    const id_teacher = this.asignacionMaterias.controls['id_teacher'].value;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará la asignatura ${asignatura.name} del profesor.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        let credenciales = { id_teacher : id_teacher, id_subject: asignatura.id};
        this.coordinadorService.deleteAsignaturaDeProfesor(credenciales).subscribe({
          next: (res: any) => {
            if (res.ok) {
              Swal.fire(
                'Eliminado!',
                `La asignatura ${asignatura.name} ha sido eliminada del profesor.`,
                'success'
              );
            } else {
              Swal.fire(
                'Error',
                'No se pudo eliminar la asignatura. Intente nuevamente.',
                'error'
              );
            }
          },
          error:(err: any) => {
            Swal.fire(
              'Error',
              'Hubo un error al procesar la solicitud. Intente más tarde.',
              'error'
            );
          },
          complete: () => {
            this.obtenerAsignaturas()
          }
        }
      );
      }
    });
  }
}
