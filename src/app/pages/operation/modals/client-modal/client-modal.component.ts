import { Component } from '@angular/core';
import {config} from "rxjs";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-client-modal',
  imports: [FormsModule,CommonModule,InputNumberModule,InputTextModule,ButtonModule],
  templateUrl: './client-modal.component.html',
  styleUrl: './client-modal.component.css'
})
export class ClientModalComponent {

  name:string="";
  lastname:string="";
  email:string="";
  number:string="";

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  guardar() {

    this.ref.close(true);
  }

  cancelar() {
    this.ref.close(false);
  }

}
