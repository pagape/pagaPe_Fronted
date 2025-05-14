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
import {NewReminderComponent} from "../../home/modals/new-reminder/new-reminder.component";
import {ClientModalComponent} from "../modals/client-modal/client-modal.component";
import {ConfirmModalComponent} from "../../../components/modals/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-list-clients',
  imports: [CommonModule,FormsModule, SelectModule,DatePickerModule,InputTextModule,ButtonModule,TableComponent],
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.css',
  providers:[DialogService]
})
export class ListClientsComponent {

  searchText: string = '';
  dateRange: Date[] | undefined;

  actions = [

    { icon: 'edit_square', action: (row: any) => this.onEdit(row)},
    { icon: 'delete_forever', action: (row: any) => this.onDelete(row)}



  ];
  columns = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Nombre' },
    { field: 'lastname', header: 'Apellido' },
    { field: 'dateR', header: 'Fecha de registro' },
    { field: 'email', header: 'Correo' },
    { field: 'number', header: 'Numero' },

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
    { nro: 1, name: 'Mario',lastname: 'Gutierrez', dateR: '10/05/2025 ',status: 'Activo', email: "mGutierrres@gmail.com",number: "987654321", state: 'A' },
    { nro: 2, name: 'Juan',lastname: 'Diaz', dateR: '01/04/2025 ',status: 'Inactivo',email: "jdiaz@gmail.com", number: "987654321", state: 'R' },
    { nro: 3, name: 'Isabel',lastname: 'Rosales', dateR: '10/03/2025 ',status: 'Activo',email: "iRosales@gmail.com" , number: "987654321", state: 'A'},
  ];
  ref: DynamicDialogRef | undefined;
  services: any[] = [
    'Telefonia','Internet','TV'

  ];

  serviceSelected:any=null;

  constructor(private router:Router, public dialogService: DialogService,private route: ActivatedRoute) {

  }
  create() {
    const ref = this.dialogService.open(ClientModalComponent, {

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
    const ref = this.dialogService.open(ClientModalComponent, {

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

  onDelete(row: any) {
    const ref = this.dialogService.open(ConfirmModalComponent, {
      data: {
        detailsCupo: {
          title: "Esta seguro  de eliminar a :",
          start: row.name + " "+row.lastname,

        },
      },
      width: '400px',
      modal: true,
      dismissableMask: false,
    });

  }

}
