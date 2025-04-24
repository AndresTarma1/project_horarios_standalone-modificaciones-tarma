import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CoordinadorService } from '../../../../../core/services/coordinador.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Horario {
  'h:i': string;
  'h:f': string;
}

interface DiaDisponible {
  dia: string;
  horas: Horario[];
}


@Component({
  selector: 'app-manual',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.css'
})
export class ManualComponent implements OnInit {



  horarioForm: FormGroup = this.fb.group(
    {
      'id_career': ['', [Validators.required, Validators.minLength(1)]],
      'id_academic_load': ['', [Validators.required, Validators.minLength(1)]],
      'id_subject': ['', [Validators.required, Validators.minLength(1)]],
      'id_group': ['', [Validators.required, Validators.minLength(1)]],
      'id_teacher': ['', [Validators.required, Validators.minLength(1)]],
      'disponibilidad': ['', Validators.required,],
      'day': '',
      'hi': '',
      'hf': ''
    }
  );

  //Injeccion del servicio del coordinador
  private coordinadorService: CoordinadorService = inject(CoordinadorService);


  /**
   *
   * @param fb
   * Desarrollamos los observables necesarios para obtener los datos del formulario
   */

  $carreras: Observable<any>;
  $cargas_academicas: Observable<any>;
  $asignaturas: Observable<any>;
  $grupos: Observable<any>;
  $profesores: Observable<any>;
  $disponibilidad: Observable<any>;


  ngOnInit(): void {
      this.obtenerCarreras();
  }
  constructor(private fb: FormBuilder, private modalService: NgbModal){

  }

  obtenerCarreras(): void{
    this.$carreras = this.coordinadorService.getCarreras();
  }

  obtenerCargasAcademicas(): void{

    let id_academic_load = this.horarioForm.controls['id_career'].value;
    this.horarioForm.patchValue({
      'id_academic_load': '',
      'id_group': '',
      'id_subject': '',
      'id_teacher': '',
      'disponibilidad': ''
    });
    this.$cargas_academicas = new BehaviorSubject(null);
    this.obtenerGrupos();
    
    if(id_academic_load){
      this.$cargas_academicas = this.coordinadorService.getCargasAcademicasCarrera(id_academic_load);
    }
  }

  obtenerGrupos(): void{
    let id_carga_academica = this.horarioForm.controls['id_academic_load'].value;
    this.horarioForm.patchValue({
      'id_group': '',
      'id_subject': '',
      'id_teacher': '',
      'disponibilidad': ''
    });
    this.obtenerAsignaturas();
    this.$grupos = new BehaviorSubject(null);
    if(id_carga_academica){
      this.$grupos = this.coordinadorService.getGrupos();
    }
  }

  obtenerAsignaturas(): void{
    let id_carga_academica = this.horarioForm.controls['id_academic_load'].value;
    let grupo = this.horarioForm.controls['id_group'].value;
    this.horarioForm.patchValue({
      'id_subject': '',
      'id_teacher': '',
      'disponibilidad': ''
    });
    this.obtenerMaestros();
    this.$asignaturas = new BehaviorSubject(null);
    if(id_carga_academica && grupo){
      this.$asignaturas = this.coordinadorService.getAsignaturasCargaAcademica(id_carga_academica);
    }
  }

  obtenerMaestros(): void{
    let id_asignatura = this.horarioForm.controls['id_subject'].value;
    this.horarioForm.patchValue({
      'id_teacher': '',
      'disponibilidad': ''
    });
    this.$profesores = new BehaviorSubject(null);
    this.obtenerDisponibilidad();
    
    if(id_asignatura){
      this.horarioForm.patchValue({'id_teacher': ''});
      this.$profesores = this.coordinadorService.getProfesoresAsignatura(id_asignatura);
      
      }
  }

  

  diasDisponibles: DiaDisponible[] = [];
  dia_hora: any;

  obtenerDisponibilidad(): void{
    this.diasDisponibles = [];
    let credenciales = {
      'id_subject' : this.horarioForm.controls['id_subject'].value,
      'id_teacher' : this.horarioForm.controls['id_teacher'].value,
      'id_group' : this.horarioForm.controls['id_group'].value,
    }


    if(credenciales.id_teacher){
      this.coordinadorService.getProfesoresDisponibilidad(credenciales).subscribe(
        (res: any) => {

          if(res.ok){
            const devolverHoraDia = (dia: string)  =>{
              return Object.values(res.dias_horas[dia]) as [{'h:i': string, 'h:f': string}];
            }
            Object.keys(res.dias_horas).forEach(
              (valor: string) =>  {
                this.diasDisponibles.push({
                  dia: valor,
                  horas: devolverHoraDia(valor)
                });
              }
            );
          }else{
            Swal.fire({
              title: 'Espera',
              text: `${res.msg}`,
              icon: 'warning'
            })
          }
        }
      );
    }else{
      this.diasDisponibles = [];
    }

  }

  controlarDias(){
    const disponibilidad = this.horarioForm.controls['disponibilidad'].value;
    const regex = /(\w+) (\d{1,2}:\d{2}:\d{2}) -- (\d{2}:\d{2}:\d{2})/;
    const match = disponibilidad.match(regex);
    
    if(match){
      this.horarioForm.get('day')?.setValue(match[1]);
      this.horarioForm.get('hi')?.setValue(match[2]);
      this.horarioForm.get('hf')?.setValue(match[3]);
    }

  }

  crearHorario(){
    console.log(this.horarioForm.value);
    this.coordinadorService.postHorarioManual(this.horarioForm.value).subscribe(
      (res: any) => {
        if(res.ok){
          Swal.fire({
            title: 'Exito',
            text: `${res.msg}`,
            icon: 'success'
          }).then(
            () => {
              this.obtenerDisponibilidad();
            }
          )
        }else{
          Swal.fire({
            title: 'Error',
            text: `${res.msg}`,
            icon: 'error'
          })

        }

      }

    )
  }

}
