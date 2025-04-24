import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, output, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Estudiante } from '../../interfaces/estudiante.interface';
import { Coordinador } from '../../interfaces/coordinador.interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { StarIcon } from 'primeng/icons/star';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../core/services/admin-service.service';
import { ModalEditComponent } from '../modal-edit/modal-edit.component';



@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {

  @Input() columns: {field: string, header: string}[] = [];
  @Input() datos: any[] = [];
  @Output() userDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() userEdit: EventEmitter<any> = new EventEmitter<any>();

  unFilter: any[];
  p: number = 1;

  nameFiltro: string;
  filtro(event: any){
    this.nameFiltro = event.target.value;
  }

  saveUser(usuario: any) {
    this.userEdit.emit(usuario);
  }

  constructor(private modalService: NgbModal){

  }

  editModal(user: any){
    const modalRef = this.modalService.open(ModalEditComponent);
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.campos = this.columns;

    modalRef.closed.subscribe(
      (user: any) => {
        if(user != undefined){
          this.userEdit.emit(user);
        }
      }
    );
  }

  total(): number{
    return this.datos.length;
  }

  ngOnInit(): void {
    this.unFilter = this.datos;
    this.nameFiltro = 'id';
  }

  filtroInput: string = '';
  buscarPorFiltro(){
    if(!this.filtroInput){
      this.datos = this.unFilter;
      return;
    }

    this.datos = this.unFilter.filter(
      (user: any) => {
        return user[this.nameFiltro].toLowerCase().startsWith(this.filtroInput.toLowerCase());
      }
    )

  }



  deleteUser(user: any): void{
    this.userDelete.emit(user);
  }


}
