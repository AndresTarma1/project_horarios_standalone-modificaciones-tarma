import { Component } from '@angular/core';
import { ScheduleComponent } from "../../../components/schedule/schedule.component";
import { NgxSpinnerService } from 'ngx-spinner';
import { TeacherService } from '../../../core/services/teacher.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [ScheduleComponent, CommonModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})
export class HorarioComponent {

  profesor:any;

  horario$: Observable<any>;

  constructor(private teacherService: TeacherService, private spinner: NgxSpinnerService){
  }

  ngOnInit(): void {
    this.profesor = JSON.parse(localStorage.getItem('profesor')!);
    this.buscarHorario();
  }


  buscarHorario(){
      this.horario$ = this.teacherService.getHorario(this.profesor.id).pipe(
        map((res: any) => {
          console.log(res);
          return res;
        })
      );
  }
}
