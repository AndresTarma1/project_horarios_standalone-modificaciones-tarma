import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SemiAutomaticoComponent } from '../semi-automatico/manual.component';
import { AutomaticoComponent } from "../automatico/automatico.component";
import { ManualComponent } from "../manual/manual.component";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [NgbNavModule, ManualComponent, AutomaticoComponent, SemiAutomaticoComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  active = 1;
}
