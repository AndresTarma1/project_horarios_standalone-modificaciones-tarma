import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Estudiante } from '../../interfaces/estudiante.interface';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {

  router = inject(Router);
  estudiante: Estudiante;

  constructor(){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.estudiante = JSON.parse(localStorage.getItem('estudiante')!);
  }

  isSidebarActive: boolean = true;

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  logout(): void{
    localStorage.removeItem('estudiante');
    this.router.navigateByUrl('/main');
  }
}
