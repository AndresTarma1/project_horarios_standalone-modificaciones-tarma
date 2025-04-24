import { Component, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/services/student.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class PerfilComponent {

  isEditing = false;

  formuliario: FormGroup = this.fb.group({
    name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    phone: [{value: '', disabled: true}, [Validators.required]],

  });

  toggleEdit(){
    this.isEditing = !this.isEditing;
  }
  estudiante: any;

  private router = inject(Router);

  constructor(private fb: FormBuilder, private studentService: StudentService){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerEstudiante();

    this.formuliario.setValue({
      name: this.estudiante.name,
      last_name: this.estudiante.last_name,
      email: this.estudiante.email,
      phone: this.estudiante.phone,
    });
  }

  obtenerEstudiante(){
    this.estudiante = JSON.parse(localStorage.getItem('estudiante')!);
  }

  saveEdit(){
    let estudiante = this.estudiante;
    estudiante.name = this.formuliario.controls['name'].value;
    estudiante.last_name = this.formuliario.controls['last_name'].value;
    this.studentService.patchMe(estudiante).subscribe(
      (res: any) => {
        if(res.ok){
          localStorage.setItem('estudiante', JSON.stringify(estudiante));
            Swal.fire({
              title: 'Perfil actualizado',
              text: 'Perfil actualizado con éxito.',
              icon: 'success'
            }).then(
              () => { this.obtenerEstudiante(); }
            );
        }
      },
      (err: any) => {
        Swal.fire({
          title: 'Error',
          text: `${err.error}`,
          icon: 'error'
          }
        );
      }
    );
  }

  cancelEdit(){
    this.isEditing = false;
  }
}
