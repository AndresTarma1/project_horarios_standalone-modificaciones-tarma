import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  isEditing = false;
  admin: any;

  toggleEdit(){
    this.isEditing = !this.isEditing;
  }
  
  constructor(private fb: FormBuilder, private adminService: AdminService){
    this.obtenerAdmin();
  }

  formulario: FormGroup = this.fb.group({
    name: ['', ],
    last_name: ['', ],
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    description: [{value: ''}, Validators.required]
  });

  obtenerAdmin(): void{
    this.admin = JSON.parse(localStorage.getItem('admin')!);
  }

  ngOnInit(): void {
    this.formulario.setValue({
      name: this.admin.name,
      last_name: this.admin.last_name,
      email: this.admin.email,
      description: this.admin.description
    });
  }


  editProfile() {
    let admin: any = {};
    admin = this.formulario.getRawValue();
    admin.id = this.admin.id;

    this.adminService.putMe(admin).subscribe((res: any) => {
      if(res.ok){
        Swal.fire({
          title: 'Exito',
          text: `Editado correctamente`,
          icon: 'success'
        }).then(() => {
          this.admin.name = admin.name;
          this.admin.last_name = admin.last_name;
          this.admin.email = admin.email;
          this.admin.description = admin.description;
          this.isEditing = false;
          localStorage.setItem('admin', JSON.stringify(this.admin));
          this.obtenerAdmin();
        });
      }
    });
  }

  cancelEdit(){
    this.isEditing = false;
  }
}
