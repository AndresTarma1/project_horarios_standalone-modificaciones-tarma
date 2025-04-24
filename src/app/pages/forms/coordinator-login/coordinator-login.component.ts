import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../../core/services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coordinator-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './coordinator-login.component.html',
  styleUrl: './coordinator-login.component.css'
})
export default class CoordinatorLoginComponent {

  coordinatorLogin: FormGroup = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  });

  constructor(private loginService: LoginService, private fb: FormBuilder, private router: Router){
    if(localStorage.getItem('coordinador')){
      this.router.navigateByUrl('/coordinator');
    }
  }

  loginCoordinador(){
    this.loginService.loginCoordinador(this.coordinatorLogin.value).subscribe(
      {
        next:  (res: any) => {
          if(res.ok){
            let coordinador: any = res.coor;
            coordinador.token = res.token;
            localStorage.setItem('coordinador', JSON.stringify(coordinador));
            this.router.navigateByUrl('/coordinator');
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
      
    );
  }

}
