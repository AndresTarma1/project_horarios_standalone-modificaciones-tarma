import { Component, inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../core/services/admin-service.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  coordinatorForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    last_name: ['', Validators.required],
    phone: ['', Validators.required],
    identify: ['', Validators.required],
    departament: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  private adminService: AdminService = inject(AdminService);

  constructor(private fb: FormBuilder)
  {

  }

  onSubmit(){
    if(this.coordinatorForm.invalid){
      return;
    }else{
      this.adminService.postCoordinador(this.coordinatorForm.value).subscribe(
        (res: any) => {
          if(res.ok){
            Swal.fire({
              title: 'Exito',
              text: `Creado correctamente`,
              icon: 'success'
            }).then(
              () => {
                this.coordinatorForm.reset();
              }
            );
          }else{
            Swal.fire({
              title: 'Error',
              text: `Ha ocurrido un error al crear a un coordinador. \n ${res.msg}`,
              icon: 'info'
            });
          }

        }
      );
    }
  }
}
