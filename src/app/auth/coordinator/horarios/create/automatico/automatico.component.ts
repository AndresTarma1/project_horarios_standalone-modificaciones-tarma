import { Component, inject, OnInit } from '@angular/core';
import { CoordinadorService } from '../../../../../core/services/coordinador.service';
import { BehaviorSubject, interval, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getBsVer } from 'ngx-bootstrap/utils';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-automatico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './automatico.component.html',
  styleUrl: './automatico.component.css'
})
export class AutomaticoComponent implements OnInit {

  private coordinatorService: CoordinadorService = inject(CoordinadorService);
  public carreras$: Observable<any>;
  public cargas_academicas$: Observable<any>;
  public grupos$: Observable<any>;

  horarioForm: FormGroup = this.fb.group({
    id_career: ['', [Validators.required]],
    id_academic_load: ['', [Validators.required]],
    id_group: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.obtenerCarreras();
  }

  obtenerCarreras(): void{
    this.carreras$ = this.coordinatorService.getCarreras();
  }

  obtenerCargasAcademicas(): void{
    let id_carrera = this.horarioForm.controls['id_career'].value;
    if(id_carrera){
      this.cargas_academicas$ = this.coordinatorService.getCargasAcademicasCarrera(id_carrera);
      return;
    }else{

      this.horarioForm.patchValue({
        id_career: '',
        id_academic_load: '',
        id_group: '',
      });
      this.obtenerGrupos();
      this.cargas_academicas$ = new BehaviorSubject(null);
    }
  }

  obtenerGrupos(): void{
    let id_carga_academica = this.horarioForm.controls['id_academic_load'].value;

    /**
     * Si la carga academica tiene un valor que no sea el por defecto, entra al if
     */
    if(id_carga_academica){

      /**
       * Si el observable grupos ya posee datos, no es necesario recargarlo
       */
      if(this.grupos$){
        return;
      }

      /**
       * Obtenemos los grupos si no hay grupos dentro del select
       */
      this.grupos$ = this.coordinatorService.getGrupos();
      return

    }else{
      /**
       * Si el usuario no ha seleccionado la carga academica se vaciara el campo para evitar...
       * submit innecesario
       */
      this.grupos$ = new BehaviorSubject(null);
    }
  }

  onSubmit(){

    let horario: any = this.horarioForm.value;

    this.coordinatorService.postHorarioAutomatico(horario).subscribe(
      (res: any) => {

        console.log(res);
        if(res.ok){

          let mensaje = '';

          const capitalizeFirstLetter = (dato: string) => {
            dato.toLowerCase();
            return dato;
          }
          res.msg.forEach((element: string) => {
              mensaje += `${capitalizeFirstLetter(element)} <br>`
          });

          Swal.fire({
            title: 'Exito...',
            html: `${mensaje}
            ${res.advertencia}`.toLowerCase(),
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Listo',
          });
        }else{
          Swal.fire({
            title: 'Error',
            text: `${res.msg}`,
            icon: 'error'
          });
        }
       }
    );
  }



}
