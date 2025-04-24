import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent {
  @Input() asignatura: any;  // Recibe el objeto asignatura para editar
  @Output() updateAsignatura = new EventEmitter<any>();
  @Output() deleteAsignatura = new EventEmitter<any>();

  editForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,  // Controla el modal
    private fb: FormBuilder  // Usa el FormBuilder para crear el formulario reactivo
  ) {
    // Inicializa el formulario reactivo con los campos de la asignatura
    this.editForm = this.fb.group({
      id: [{ value: '', disabled: true }],  // El id será deshabilitado
      name: ['', Validators.required],
      description: ['', Validators.required],
      hours_week: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.asignatura) {
      this.editForm.patchValue({
        id: this.asignatura.id,
        name: this.asignatura.name,
        description: this.asignatura.description,
        hours_week: this.asignatura.hours_week,
      });
    }
  }

  // Método para enviar los datos editados
  onSubmit() {
    if (this.editForm.valid) {
      this.updateAsignatura.emit(this.editForm.getRawValue());
      this.activeModal.close();
    }
  }

  borrarAsignatura(): void{
    this.deleteAsignatura.emit(this.editForm.getRawValue());
    this.activeModal.close();
  }
}
