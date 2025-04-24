import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-group-modal',
  templateUrl: './edit-group-modal.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./edit-group-modal.component.css']
})
export class EditGroupModalComponent {
  @Input() grupo: { id: number; name: string; cambios?: boolean};
  @Output() save = new EventEmitter<{ id: number; name: string }>();
  @Output() delete = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal) {}

  onSave() {
    this.grupo.cambios = true;  // Indica que se ha realizado algún cambio en el grupo
    this.save.emit(this.grupo);
    this.activeModal.close();
  }

  onDelete() {
    this.delete.emit(this.grupo);
    this.activeModal.close();
  }
}
