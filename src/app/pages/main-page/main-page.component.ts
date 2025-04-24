import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterModule, NgbDropdownModule, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class MainPageComponent {

  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSelectRole(role: string): void {
    console.log(`Seleccionaste: ${role}`);
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.group')) {
      this.isDropdownOpen = false; // Cierra el dropdown si el clic no es en el botón o menú
    }
  }

  isMobileMenuOpen = false; // Estado del menú móvil

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen; // Alterna entre mostrar y ocultar
  }
}
