import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';


interface Dia {
  dia: string;
  clases: {
    id: number;
    name: string;
    "h:i": string;
    "h:f": string;
  }[];
}
@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, NgbPopoverModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {

  @Input() horario: any;
  @Input() teacher? : boolean = false;

  ngOnInit(): void {
    this.procesarHorario();
  }

  dias = [
    'lunes'
  , 'martes'
  , 'miercoles'
  , 'jueves'
  , 'viernes'
  , 'sabado'
];


horas = [

  '08:00'
  , '09:00'
  , '10:00'
  , '11:00'
  , '12:00'
  , '13:00'
  , '14:00'
  , '15:00'
  , '16:00'
  , '17:00'
  , '18:00'
];

horasFinal = [
  , '09:00'
  , '10:00'
  , '11:00'
  , '12:00'
  , '13:00'
  , '14:00'
  , '15:00'
  , '16:00'
  , '17:00'
  , '18:00'
  , '19:00'
]

horarioTransformado: any = {}; // Objeto que contendrá las clases organizadas por días y horas

procesarHorario() {

  this.horarioTransformado = {}; // Reinicia el horario

  for (const dia of this.dias) {
    this.horarioTransformado[dia] = this.horas.map(() => null); // Inicializa cada hora como `null`
  }

  for (const diaData of this.horario) {
    const dia = diaData.dia;
    for (const clase of diaData.clases) {
      const inicioIndex = this.horas.indexOf(clase['h:i']);
      const finIndex = this.horas.indexOf(clase['h:f']);

      if (inicioIndex === -1 || finIndex === -1) continue;

      // Asignar la clase a la hora inicial
      this.horarioTransformado[dia][inicioIndex] = { ...clase, rowspan: finIndex - inicioIndex };

      // Rellena las horas intermedias con un marcador para evitar celdas duplicadas
      for (let i = inicioIndex + 1; i < finIndex; i++) {
        this.horarioTransformado[dia][i] = { covered: true }; // Usa un marcador para celdas cubiertas
      }
    }
  }
}




  // transformarHorario(horario: any): any {
  //   const horarioTransformado : any = {
  //     lunes: ['', '', '', '', ''],
  //     martes: ['', '', '', '', ''],
  //     miercoles: ['', '', '', '', ''],
  //     jueves: ['', '', '', '', ''],
  //     viernes: ['', '', '', '', ''],
  //     sabado: ['', '', '', '', '']
  //   };

  //   horario.forEach((dia: any) => {
  //     dia.clases.forEach((clase: any) => {
  //       const horaInicio = clase["h:i"];
  //       const indiceHora = this.obtenerIndiceHora(horaInicio);

  //       if (indiceHora !== -1) {
  //         horarioTransformado[dia.dia][indiceHora] = clase.name;
  //       }
  //     });
  //   });

  //   return horarioTransformado;
  // }

  // obtenerIndiceHora(horaInicio: string): number {
  //   const horas: any = {
  //     "08:00:00": 0,
  //     "10:00:00": 1,
  //     "12:00:00": 2,
  //     "14:00:00": 3,
  //     "16:00:00": 4
  //   };

  //   return horas[horaInicio] !== undefined ? horas[horaInicio] : -1;
  // }


}
