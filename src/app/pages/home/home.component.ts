import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SelectModule} from "primeng/select";
import {DatePickerModule} from "primeng/datepicker";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {TableComponent} from "../../components/table/table.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {NewReminderComponent} from "./modals/new-reminder/new-reminder.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule, SelectModule,DatePickerModule,InputTextModule,ButtonModule,TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone:true,
  providers: [ DialogService],

})
export class HomeComponent {
  searchText: string = '';
  dateRange: Date[] | undefined;
  stateSelected: any;


  states = [
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '0' },
  ];

  actions = [



  ];
  columns = [
    { field: 'nro', header: 'Nro de Recordatorio' },
    { field: 'name', header: 'Nombre' },
    { field: 'desc', header: 'Descripcion' },
    { field: 'dateSend', header: 'Fecha de envio' },
    {
      field: 'active',
      header: 'Estado',
      type: 'tag',
      colorMap: { Activo: 'green', Inactivo: 'red', Pendiente: 'orange' },
    },


  ];


  data = [
    { nro: 1, name: 'Recordatorio 1',des: 'Recordatorio fin de mes abril', dateSend: '10/05/2025 ',status: 'Pendiente',  active: false },
    { nro: 2, name: 'Recordatorio 1',des: 'Recordatorio fin de mes marzo', dateSend: '01/04/2025 ',status: 'Pendiente',  active: false },
    { nro: 3, name: 'Recordatorio 1',des: 'Recordatorio inicio de mes marzo', dateSend: '10/03/2025 ',status: 'Respondido',  active: false},
  ];
  ref: DynamicDialogRef | undefined;

  constructor(private router:Router, private authService: AuthService,public dialogService: DialogService,private route: ActivatedRoute) {

    console.log(this.authService.getUser())
  }

  private onBalance(row: any) {
    // const ref = this.dialogService.open(AssociateWeightComponent, {
    //
    //   modal: true,
    //   dismissableMask: false,
    // });
    // ref.onClose.subscribe(result => {
    //   if (result) {
    //     console.log(result);
    //
    //   } else {
    //     console.log('modal cerrado');
    //   }
    // });

  }

  private onView(row: any) {

    // const ref = this.dialogService.open(InfoBalanceComponent, {
    //
    //   width:'700px',
    //   modal: true,
    //   dismissableMask: false,
    // });
    // ref.onClose.subscribe(result => {
    //   if (result) {
    //     console.log(result);
    //
    //   } else {
    //     console.log('modal cerrado');
    //   }
    // });

  }

  create() {
    const ref = this.dialogService.open(NewReminderComponent, {


      modal: true,
      dismissableMask: true,
    });
    ref.onClose.subscribe(result => {
      if (result) {
        console.log(result);

      } else {
        console.log('modal cerrado');
      }
    });

  }
}
