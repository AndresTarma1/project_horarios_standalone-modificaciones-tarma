import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{

  isSidebarActive: boolean = true;
  coordinador: any;

  constructor(){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.coordinador = JSON.parse(localStorage.getItem('coordinador')!);

  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }


  router: Router = inject(Router);
  logout(): void{
    localStorage.removeItem('coordinador');
    this.router.navigateByUrl('/main');
  }
}
