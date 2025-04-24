import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CoordinadorService } from '../../../core/services/coordinador.service';

interface Task {
  id: number;
  description: string;
}

interface Event {
  date: string;
  description: string;
}


@Component({
  selector: 'app-coordinator-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class CoordinatorDashboardComponent implements OnInit {

  coordinadorService: CoordinadorService = inject(CoordinadorService);

  tasks: Task[] = [
    { id: 1, description: 'Revisar solicitudes de cambio de carrera' },
    { id: 2, description: 'Preparar informe mensual de rendimiento' },
    { id: 3, description: 'Reunión con el decano' },
    { id: 4, description: 'Actualizar guía de estudios' },
    { id: 5, description: 'Responder correos de estudiantes' }
  ];

  events: Event[] = [
    { date: '10 May', description: 'Inicio de inscripciones' },
    { date: '15 May', description: 'Reunión de facultad' },
    { date: '20 May', description: 'Taller de orientación' },
    { date: '1 Jun', description: 'Fecha límite de entrega de notas' },
    { date: '5 Jun', description: 'Ceremonia de graduación' }
  ];

  constructor() {
    this.obtenerDatos();
  }

  estudiantes_lenght: number = 0;
  grupos_lenght: number = 0;
  profesores_lenght: number = 0;

  obtenerDatos(): void {
    this.coordinadorService.getEstudiantes().subscribe(
      (res: any) => {
        if(res.student){
          this.estudiantes_lenght = res.student.length;
        }else{
          this.estudiantes_lenght = 0;
        }
      }
    );

    this.coordinadorService.getGrupos().subscribe(
      (res: any) => {
        if(res.groups){
          this.grupos_lenght = res.groups.length;
        }else{
          this.grupos_lenght = 0;
        }
      }
    );

    this.coordinadorService.getProfesores().subscribe(
      (res: any) => {
        if(res.teachers){
          this.profesores_lenght = res.teachers.length;
        }else{
          this.profesores_lenght = 0;
        }
      }
    )
  }

  ngOnInit(): void {
    // Aquí puedes agregar cualquier lógica de inicialización necesaria
  }
}