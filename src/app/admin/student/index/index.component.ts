import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { catchError, map, Observable, retry } from 'rxjs';
import { AdminService } from '../../../core/services/admin-service.service';
import { TableComponent } from "../../../components/table/table.component";
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { columnasEstudiante, Estudiante } from '../../../interfaces/estudiante.interface';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ErrorServidorComponent } from "../../../components/error-servidor/error-servidor.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [AsyncPipe, CommonModule, TableComponent, NgxSpinnerModule, FormsModule, ErrorServidorComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {

  public estudiantes$: Observable<any>;
  public columnas: {field: string, header: string}[] = columnasEstudiante;
  adminService: AdminService = inject(AdminService);
  spinner: NgxSpinnerService = inject(NgxSpinnerService);
  error: boolean = false;

  constructor(){
  }

  ngOnInit(): void {
    this.spinner.show();
    this.obtenerEstudiantes()
  }

  obtenerEstudiantes(){
    this.estudiantes$ =  this.adminService.getEstudiantes().pipe(
      map( (res: any) => {
        if(!res.student){
          res.student = [];
        }
        return res;
      }),
      retry({count: 5, delay: 4000}),
      catchError ((err: any) => {
        this.error = true;
        throw new Error("Ah ocurrido un error en el servidor");
      })
    );
  }

  editarEstudiante(estudiante: Estudiante){
    this.adminService.patchEstudiante(estudiante).subscribe({
      next: (res: any) => {
        if(res.ok){
          Swal.fire({
            title: 'Exito',
            text: 'Editado con exito',
            icon: 'success'
          }).then(
            () => {
              this.obtenerEstudiantes();
            }
          );
        }else{
          Swal.fire({
            title: 'Error',
            text: 'Ah ocurrido un error al intentar editar al estudiante',
            icon: 'error'
          });
        }
      }
    })
  }

  eliminarEstudiante(estudiante: Estudiante){
    Swal.fire({
      title: "Estas seguro?",
      text: `Vas a borrar a ${estudiante.name} ${estudiante.last_name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteProfesor(estudiante.id).subscribe(
          (res: any) => {
            if(res.ok){
              Swal.fire({
                title: "Eliminado!",
                text: `${estudiante.name} eliminado exitosamente!`,
                icon: "success"
              }).then(
                () => { this.obtenerEstudiantes(); }
              );
            }else{
              Swal.fire({
                title: "Error!",
                text: `El estudiante ${estudiante.name} no se ha logrado eliminar!`,
                icon: "error"
              });
            }
          }
        )
      }
    });
  }
}
