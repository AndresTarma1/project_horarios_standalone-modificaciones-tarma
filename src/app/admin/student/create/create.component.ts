import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../core/services/admin-service.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgbTooltipModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  studenForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: [{value: '', disabled: true},[Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    identify : ['', [Validators.required]]
  });

  ngOnInit(): void {

  }


  private adminService: AdminService = inject(AdminService);
  constructor(private fb: FormBuilder){
    this.setupEmailGenerator();
  }

  setupEmailGenerator() {
    // Suscribir a cambios en los campos de nombre y apellido
    this.studenForm.get('name')?.valueChanges.subscribe(() => this.generateEmail());
    this.studenForm.get('last_name')?.valueChanges.subscribe(() => this.generateEmail());
  }

  generateEmail() {
    const name = this.studenForm.get('name')?.value || '';
    const lastName = this.studenForm.get('last_name')?.value || '';
  
    const nameParts = name ? name.split(' ') : [];
    const lastNameParts = lastName ? lastName.split(' ') : [];
  
    const firstInitial = nameParts[0]?.charAt(0) || '';
    const secondInitial = nameParts[1]?.charAt(0) || '';
    const firstLastName = lastNameParts[0] || '';
    const secondLastInitial = lastNameParts[1]?.charAt(0) || '';
  
    const email = `${firstInitial}${secondInitial}${firstLastName}${secondLastInitial}`.toLowerCase() + '@estudiante.com';
  
    this.studenForm.get('email')?.setValue(email, { emitEvent: false });
  }
  onSubmit(){
    this.adminService.postEstudiante(this.studenForm.getRawValue()).subscribe(
      (res: any) => {
        console.log(res);
        if(res.ok){
          Swal.fire({
            title: 'Creado Correctamente',
            text: `El estudiante ${this.studenForm.controls['name'].value} ha sido creado correctamente`,
            icon: 'success'
          }).then(
            () => {
              this.studenForm.reset();
            }
          );
        }else{
          Swal.fire({
            title: 'Precaucion',
            text: `${res.message}`,
            icon: 'warning'
          });
        }
      }
    );
  }
}
