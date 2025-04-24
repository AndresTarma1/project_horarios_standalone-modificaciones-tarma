import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Profesor } from '../../interfaces/profesor.interface';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent {

  isSidebarActive = true;
  toggleSidebar(){
    this.isSidebarActive = !this.isSidebarActive;
  }

  profesor: Profesor;
  constructor(private router: Router){
    this.profesor = JSON.parse(localStorage.getItem('profesor')!);
  }

  logout(){
    localStorage.removeItem('profesor');
    this.router.navigateByUrl('main');
  }
}
