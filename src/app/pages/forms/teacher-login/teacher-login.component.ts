import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-teacher-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './teacher-login.component.html',
  styleUrl: './teacher-login.component.css'
})
export default class TeacherLoginComponent {

  teacherLogin: FormGroup = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  });


  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router){
    if(localStorage.getItem('profesor')){
      router.navigateByUrl('/teacher');
    }
  }


  loginProfesor(){
    if(this.teacherLogin.invalid){
      return;
    }

    // console.log(this.teacherLogin.value);
    this.loginService.loginProfesor(this.teacherLogin.value)
    .subscribe({
      next: (res:any) => {
        if(res.ok){
          localStorage.setItem('profesor', JSON.stringify(res.teacher));
          this.router.navigateByUrl('teacher');
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
    }
      
    )
  }
}
