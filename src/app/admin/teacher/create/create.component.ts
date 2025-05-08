import { Component, inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../core/services/admin-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  teacherForm: FormGroup;

  private adminService: AdminService = inject(AdminService);

  constructor(private fb: FormBuilder) {
    this.teacherForm = this.fb.group({
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      identify: ['', [Validators.required, Validators.minLength(7)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      password: [{value: '', disabled: true}, [Validators.required]],
      phone: ['', [Validators.required]],
      specialty: ['', Validators.required]
    });

    this.generarEmailPassword();
  }

  generarEmailPassword(): void{
    this.teacherForm.get('name')?.valueChanges.subscribe( () => this.generarEmail());
    this.teacherForm.get('last_name')?.valueChanges.subscribe( () => this.generarEmail());
    this.teacherForm.get('identify')?.valueChanges.subscribe( () => this.generarPassword());
  }

  generarPassword(): void{
    const n_documento = this.teacherForm.get('identify')?.value;
    this.teacherForm.get('password')?.setValue(`Aa${n_documento}`, { emitEvent: false})
  }

  generarEmail(): void {
    const name = this.teacherForm.get('name')?.value || ''; // Si es null o undefined, se asigna una cadena vacía
    const last_name = this.teacherForm.get('last_name')?.value || ''; // Lo mismo para last_name
  
    const nameParts = name ? name.split(' ') : [];
    const surnameParts = last_name ? last_name.split(' ') : [];
  
    const firstInitial = nameParts[0]?.charAt(0) || '';
    const secondInitial = nameParts[1]?.charAt(0) || '';
    const firstLastName = surnameParts[0] || '';
    const secondLastInitial = surnameParts[1]?.charAt(0) || '';
  
    const email = `${firstInitial}${secondInitial}${firstLastName}${secondLastInitial}`.toLowerCase() + '@profesor.com';
  
    this.teacherForm.get('email')?.setValue(email, { emitEvent: false });
  }

  onSubmit() {
    if (this.teacherForm.valid) {
      this.adminService.postProfesor(this.teacherForm.getRawValue()).subscribe(
        (res: any) => {
          if(res.ok){
            Swal.fire({
              icon: 'success',
              title: 'Correcto',
              text: `El profesor se ha creado correctamente`
            }).then(
              () => {
                this.teacherForm.reset();
              }
            );
          }else{
            Swal.fire({
              icon: 'info',
              title: 'Error',
              text: `${res.msg}`
            });
        }
        }
      );
    }
  }
}
