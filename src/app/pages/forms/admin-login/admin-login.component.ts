import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../../core/services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export default class AdminLoginComponent {

  adminLogin: FormGroup = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,private loginService: LoginService, private router: Router){

    if(localStorage.getItem('admin')){
      router.navigateByUrl('/admin');
    }

  }

  loginAdmin(){
    if(this.adminLogin.invalid){
      return;
    }

    this.loginService.loginAdmin(this.adminLogin.value).subscribe({
      next: (res: any) => {
        if(res.ok){
          localStorage.setItem('admin', JSON.stringify(res.admin));
          this.router.navigateByUrl('admin');
        }else{
          Swal.fire({
            title: 'Error',
            text: `${res.msg}`,
            icon: 'info'
          })
        }
      },
      error: (err: any) => {
        alert('El servidor no responde');
      }
  })
      
  }
}
