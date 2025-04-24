import { Component, inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, catchError, BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { CoordinadorService } from '../../../../../core/services/coordinador.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-semiautomatico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.css'
})
export class SemiAutomaticoComponent {

  horarioForm: FormGroup = this.fb.group({
    id_career: ['', [Validators.required]],
    id_academic_load: ['', [Validators.required]],
    id_subject: ['', [Validators.required]],
    id_teacher: ['', [Validators.required]],
    id_group: ['', [Validators.required]]
});

  private coordinadorService: CoordinadorService = inject(CoordinadorService);

  public carreras$: Observable<any>;
  public cargaAcademicas$: Observable<any>;
  public asignaturas$: Observable<any>;
  public profesores$: Observable<any>;
  public grupos$: Observable<any>;
  private id: number;


  constructor(private fb: FormBuilder){
  }

  ngOnInit(): void {
    this.obtenerCarreras();
  }

  obtenerCarreras(){
    this.carreras$ = this.coordinadorService.getCarreras();
  }

  obtenerCargasAcademicas(): void{
    let id_carrera =this.horarioForm.controls['id_career'].value;
    
    this.horarioForm.patchValue({
      id_career: '',
      id_academic_load: '',
      id_group: '',
      id_subject: '',
      id_teacher: '',
    });

    this.cargaAcademicas$ = new BehaviorSubject(null);
    this.obtenerGrupos()
    
    if(id_carrera){
      this.cargaAcademicas$ = this.coordinadorService.getCargasAcademicasCarrera(id_carrera);
    }
  }


  obtenerGrupos() : void{
    let id_carga_academica = this.horarioForm.controls['id_academic_load'].value;
    
    this.horarioForm.patchValue({
      id_academic_load: '',
      id_group: '',
      id_subject: '',
      id_teacher: '',
    });

    this.grupos$ = new BehaviorSubject(null);
    this.obtenerAsignaturas()

    if(id_carga_academica){
      this.grupos$ = this.coordinadorService.getGrupos();
    }
  }

  obtenerAsignaturas(): void{
    let cargaAcademica = this.horarioForm.controls['id_academic_load'].value;
    let id_grupo = this.horarioForm.controls['id_group'].value;

    this.horarioForm.patchValue({
      id_subject: '',
      id_teacher: '',
    });

    this.asignaturas$ = new BehaviorSubject(null);
    this.obtenerProfesores();
    if(id_grupo){
      this.asignaturas$ = this.coordinadorService.getAsignaturasCargaAcademica(cargaAcademica);
    }
}

  obtenerProfesores(): void{
    let asignatura: string = this.horarioForm.controls['id_subject'].value;

    this.horarioForm.patchValue({
      id_teacher: '',
    });
    this.profesores$ = new BehaviorSubject(null);
    if(asignatura){
      this.profesores$ = this.coordinadorService.getProfesoresAsignatura(asignatura);
    }

  }

  crearHorario(){
    let horario: any = this.horarioForm.value;
    this.coordinadorService.postHorario(horario).subscribe({
      next: (res: any) => {
        if(res.ok){
          Swal.fire({
            title: 'Exito',
            text: 'Horario Creado Correctamente',
            icon: 'success'
          });
        }else{
          Swal.fire({
            title: 'Error',
            text: `${res.msg}`,
            icon: 'error'
          });
        }
      }
    });
  }
}
