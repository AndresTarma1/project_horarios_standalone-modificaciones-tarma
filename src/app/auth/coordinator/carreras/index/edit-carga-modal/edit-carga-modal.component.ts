import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'; // Para mostrar alertas de confirmación

@Component({
  selector: 'app-edit-carga-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-carga-modal.component.html',
  styleUrls: ['./edit-carga-modal.component.css']
})
export class EditCargaModalComponent {
  @Input() cargaAcademica: any;

  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  constructor(public activeModal: NgbActiveModal) {}

  // Cerrar el modal
  closeModal() {
    this.activeModal.close();
  }


  saveChanges() {
    this.save.emit(this.cargaAcademica);
    this.activeModal.close();
  }

  // Eliminar la carga académica
  deleteCarga() {
    this.delete.emit(this.cargaAcademica);
    this.activeModal.close();
  }
}
