import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {

  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }


  router: Router = inject(Router);
  logout(): void{
    localStorage.removeItem('admin');
    this.router.navigateByUrl('/main');
  }
}
