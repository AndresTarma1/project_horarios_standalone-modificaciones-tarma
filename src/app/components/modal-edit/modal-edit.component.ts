import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-edit.component.html',
  styleUrl: './modal-edit.component.css',
})
export class ModalEditComponent implements OnDestroy, OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() user?: any;
  @Input() grupo?: any;
  @Input() campos: { field: string; header: string }[];
  typeUser: string;
  formulario: FormGroup = this.fb.group({});
  usuario: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.verificarUsuario();
  }

  verificarUsuario() {
    if (this.user) {
      if (this.user.id.startsWith('COOR')) {
        this.typeUser = 'coordinador';
      } else if (this.user.id.startsWith('EST')) {
        this.typeUser = 'estudiante';
      } else if (this.user.id.startsWith('PRO')) {
        this.typeUser = 'profesor';
      }
      this.crearFormulario();
    } else if (this.grupo) {
      this.crearFormulario();
    }
  }

  crearFormulario() {
    if (this.typeUser) {
      this.campos.forEach((campo) => {
        if (campo.field == 'id') {
          this.formulario.addControl(
            campo.field,
            this.fb.control({ value: this.user[campo.field], disabled: true })
          );
        } else {
          this.formulario.addControl(
            campo.field,
            this.fb.control(this.user[campo.field], Validators.required)
          );
        }
      });
    } else {
      this.campos.forEach((campo) => {
        if (campo.field == 'id') {
          this.formulario.addControl(
            campo.field,
            this.fb.control({ value: this.grupo[campo.field], disabled: true })
          );
        } else {
          this.formulario.addControl(
            campo.field,
            this.fb.control(this.grupo[campo.field], Validators.required)
          );
        }
      });
    }
  }

  borrarGrupo() {
    this.formulario.controls['id'].enable();

    let grupo: { id: number; delete: boolean } = {
      id: this.formulario.controls['id'].value,
      delete: true
    };
    this.activeModal.close(grupo);
  }

  onSubmit() {
    if (this.user) {
      this.formulario.controls['id'].enable();
      let usuario = this.formulario.value;
      this.activeModal.close(usuario);
    } else {
      this.formulario.controls['id'].enable();
      let grupo = this.formulario.value;
      this.activeModal.close(grupo);
    }
  }
}
