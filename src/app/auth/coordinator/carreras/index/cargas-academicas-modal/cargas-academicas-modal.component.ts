import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cargas-academicas-modal',
  standalone: true,
  imports: [CommonModule, NgbCollapseModule, ReactiveFormsModule],
  templateUrl: './cargas-academicas-modal.component.html',
  styleUrl: './cargas-academicas-modal.component.css'
})
export class CargasAcademicasModalComponent {

  @Input() carrera: any;
  formulario: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.formulario = this.fb.group({
      id_career : [this.carrera.id],
      name: ['', Validators.required],
    });
  }


  crearCargaAcademica(): void{
    this.activeModal.close(this.formulario.value);
  }
}
