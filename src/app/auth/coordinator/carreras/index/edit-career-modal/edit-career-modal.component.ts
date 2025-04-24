import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-career-modal',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './edit-career-modal.component.html',
  styleUrls: ['./edit-career-modal.component.css']
})
export class EditCareerModalComponent {
  @Input() carrera: { id: number; name: string; description: string };
  @Output() save = new EventEmitter<{ id: number; name: string; description: string }>();
  @Output() delete = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal) {}

  onSave() {
    this.save.emit(this.carrera);
    this.activeModal.close();
  }

  onDelete() {

    this.delete.emit(this.carrera);
    this.activeModal.close();
  }
}
