import { Component } from '@angular/core';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SelectModule} from "primeng/select";
import {DatePickerModule} from "primeng/datepicker";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {TableComponent} from "../../../components/table/table.component";
import {ClientModalComponent} from "../modals/client-modal/client-modal.component";
import {ClientServiceModalComponent} from "../modals/client-service-modal/client-service-modal.component";
import {ConfirmModalComponent} from "../../../components/modals/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-list-client-services',
  imports: [CommonModule,FormsModule, SelectModule,DatePickerModule,InputTextModule,ButtonModule,TableComponent],
  templateUrl: './list-client-services.component.html',
  styleUrl: './list-client-services.component.css',
  providers:[DialogService]
})
export class ListClientServicesComponent {
  searchText: string = '';
  dateStart: Date | undefined;

  dateEnd:Date | undefined;
  actions = [

    { icon: 'edit_square', action: (row: any) => this.onEdit(row)},
    { icon: 'delete_forever', action: (row: any) => this.onDelete(row)}



  ];
  columns = [
    { field: 'nro', header: 'Nro.' },
    { field: 'name', header: 'Nombre' },
    { field: 'lastname', header: 'Apellido' },
    { field: 'service', header: 'Tipo de servicio' },
    { field: 'dateS', header: 'Fecha de inicio' },
    { field: 'dateE', header: 'Fecha de fin' },
    { field: 'dateP', header: 'Fecha de pago' },
    { field: 'monto', header: 'Monto' },
    {
      field: 'status',
      header: 'Estado',
      type: 'tag',
      colorMap: { Activo: 'green', Inactivo: 'red', Pendiente: 'orange' },
    },
    {
      field: 'actions',
      header: 'Opciones',
      type: 'actions',
      actions: this.actions,
    },

  ];


  data = [
    { nro: 1, name: 'Mario',lastname: 'Gutierrez',service: 'Telefonia', dateS: '10/05/2025 ', dateE: '10/10/2026 ',dateP: 'quincena',monto: 'S/29.90',status: 'Activo',  state: 'A' },
    { nro: 2, name: 'Juan',lastname: 'Diaz',service: 'TV',  dateS: '10/03/2025 ',dateE: '01/04/2026 ',dateP: 'mensual',status: 'Activo', monto: 'S/50.00', state: 'A' },
    { nro: 3,  name: 'Isabel',lastname: 'Rosales', service: 'Internet',dateS: '10/02/2025 ', dateE: '10/03/2026 ',dateP: 'quincena',monto: 'S/20.00',status: 'Activo',  state: 'A'},
  ];
  ref: DynamicDialogRef | undefined;
  services: any[] = [
    'Telefonia','Internet','TV'

  ];

  serviceSelected:any=null;

  constructor(private router:Router, public dialogService: DialogService,private route: ActivatedRoute) {

  }
  create() {
    const ref = this.dialogService.open(ClientServiceModalComponent, {

      data:'Crear',
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

  onEdit(row: any) {
    const ref = this.dialogService.open(ClientServiceModalComponent, {

      data:'Editar',
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

  //
  onDelete(row: any) {
    const ref = this.dialogService.open(ConfirmModalComponent, {
      data: {
        detailsCupo: {
          title: "Se eliminara el servicio de :",
          start: row.name + " " +row.lastname,
          end: row.service,
        },
      },
      width: '400px',
      modal: true,
      dismissableMask: false,
    });

  }
}
