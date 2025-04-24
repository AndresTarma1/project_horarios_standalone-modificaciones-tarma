import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{


  isEditing = false;
  toggleEdit(){
    this.isEditing = !this.isEditing;
  }

  formulario: FormGroup = this.fb.group({
    name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    phone: [{value: '', disabled: true}, [Validators.required]]
  });

  profesor: any;
  constructor(private fb: FormBuilder){

  }

  ngOnInit(): void {

    this.obtenerMaestro();

    this.formulario.setValue({
      name: this.profesor.name,
      last_name: this.profesor.last_name,
      email: this.profesor.email,
      phone: this.profesor.phone,
    });
  }

  cancelEdit(){
    this.isEditing = false;
  }

  private teacherService = inject(TeacherService);
  saveEdit() {
    let profesor = this.profesor;
    profesor.name = this.formulario.controls['name'].value;
    profesor.last_name = this.formulario.controls['last_name'].value;
    this.teacherService.patchMe(profesor).subscribe(
      (res: any) => {
        if(res.ok){
          localStorage.setItem('profesor', JSON.stringify(profesor));
          Swal.fire({
            title: 'Perfil actualizado',
            text: 'Perfil actualizado con éxito.',
            icon: 'success'
          }).then(
              () => {
                this.obtenerMaestro();
                this.isEditing = false;
              }
          );
        }


      }
    );

    }
    obtenerMaestro(): void{
      this.profesor = JSON.parse(localStorage.getItem('profesor')!);
    }
}
