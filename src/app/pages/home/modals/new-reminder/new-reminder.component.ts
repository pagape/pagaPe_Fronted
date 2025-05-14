import { Component } from '@angular/core';
import {RadioButtonModule} from "primeng/radiobutton";
import {SelectModule} from "primeng/select";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-new-reminder',
  imports: [RadioButtonModule,SelectModule,CommonModule,FormsModule,InputTextModule, InputNumberModule],
  templateUrl: './new-reminder.component.html',
  styleUrl: './new-reminder.component.css'
})
export class NewReminderComponent {

  selectedOption: any=null;
  numberSelected: any=null
  serviceSelected:any=null;
  name:string="";
  desc:string="";
  peso: any = 0.000 ;
  options: any[] = [
    { name: 'Si', key: 'S' },
    { name: 'No', key: 'N' },

  ];
  numbers: any[] = [
    '983508322','947048797'

  ];
  services: any[] = [
    'Telefonia','Internet','TV'

  ];
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  guardar() {

    this.ref.close(true);
  }

  cancelar() {
    this.ref.close(false);
  }

}
