import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoordinadorService } from '../../../core/services/coordinador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  coordinador: any;
  isEditing = false;

  coordinadorService: CoordinadorService = inject(CoordinadorService);

  formulario: FormGroup = this.fb.group({
    name: ['', Validators.required],
    last_name: ['', Validators.required],
    departament: ['', Validators.required],
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder){
    this.obtenerCoordinador();
  }

  obtenerCoordinador(): void{
    this.coordinador = JSON.parse(localStorage.getItem('coordinador')!);
  }

  ngOnInit(): void {
    this.formulario.setValue({
      name: this.coordinador.name,
      last_name: this.coordinador.last_name,
      departament: this.coordinador.departament,
      email: this.coordinador.email,
    });
  }

  submitEdit(){

    let coordinador: any = {};
    coordinador = this.formulario.value;
    coordinador.id = this.coordinador.id;

    this.coordinadorService.putMe(coordinador).subscribe((res: any) => {
      if(res.ok){
        Swal.fire({
          title: 'Exito',
          text: `Editado correctamente`,
          icon: 'success'
        }).then(() => {
          this.coordinador.name = coordinador.name;
          this.coordinador.last_name = coordinador.last_name;
          this.coordinador.departament = coordinador.departament;
          this.isEditing = false;
          localStorage.setItem('coordinador', JSON.stringify(this.coordinador));
          this.obtenerCoordinador();
        });
      }
    });
  }

  toggleEdit(){
    this.isEditing = !this.isEditing;
  }

  cancelEdit(){
    this.isEditing = false;
  }
}
