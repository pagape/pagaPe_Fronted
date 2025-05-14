import { Component } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {SelectModule} from "primeng/select";
import {DatePickerModule} from "primeng/datepicker";

@Component({
  selector: 'app-client-service-modal',
  imports: [FormsModule,CommonModule,InputNumberModule,InputTextModule,ButtonModule,SelectModule,DatePickerModule],
  templateUrl: './client-service-modal.component.html',
  styleUrl: './client-service-modal.component.css'
})
export class ClientServiceModalComponent {
  name:string="";
  peso: any = 0.000 ;
  serviceSelected:any=null;
  paymentSelected:any=null;
  dateRange: Date[] | undefined;

  services: any[] = [
    'Telefonia','Internet','TV'

  ];

  payments: any[] = [
    'mensual','quincenal','bimestral'

  ];
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  guardar() {

    this.ref.close(true);
  }

  cancelar() {
    this.ref.close(false);
  }
}
