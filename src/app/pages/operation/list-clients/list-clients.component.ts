import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { TableComponent } from "../../../components/table/table.component";
import { ClientModalComponent } from "../modals/client-modal/client-modal.component";
import { ConfirmModalComponent } from "../../../components/modals/confirm-modal/confirm-modal.component";
import { ClientService } from "../../../services/client.service";
import { Client } from "../../../models/client.model";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: 'app-list-clients',
  imports: [
    CommonModule, 
    FormsModule, 
    SelectModule, 
    DatePickerModule, 
    InputTextModule, 
    ButtonModule, 
    TableComponent,
    ToastModule
  ],
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.css',
  providers: [DialogService, MessageService]
})
export class ListClientsComponent implements OnInit {
  searchText: string = '';
  dateRange: Date[] | undefined;
  isLoading: boolean = false;
  clients: Client[] = [];

  actions = [
    { icon: 'edit_square', action: (row: any) => this.onEdit(row) },
    { icon: 'delete_forever', action: (row: any) => this.onDelete(row) },
    { icon: 'history', action: (row: any) => this.viewHistory(row) }
  ];

  columns = [
    { field: 'id', header: 'Id' },
    { field: 'userFirstName', header: 'Nombre' },
    { field: 'userLastName', header: 'Apellido' },
    { field: 'createdAt', header: 'Fecha de registro' },
    { field: 'userEmail', header: 'Correo' },
    { field: 'userPhone', header: 'Número' },
    {
      field: 'actions',
      header: 'Opciones',
      type: 'actions',
      actions: this.actions,
    },
  ];

  data: Client[] = [];
  ref: DynamicDialogRef | undefined;
  services: any[] = [
    'Telefonia', 'Internet', 'TV'
  ];

  serviceSelected: any = null;

  constructor(
    private router: Router, 
    public dialogService: DialogService, 
    private route: ActivatedRoute,
    private clientService: ClientService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.data = clients;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes'
        });
        this.isLoading = false;
      }
    });
  }

  create() {
    const ref = this.dialogService.open(ClientModalComponent, {
      data: {
        mode: 'Crear'
      },
      header: 'Crear nuevo cliente',
      width: '500px',
      modal: true,
      dismissableMask: true,
    });
    
    ref.onClose.subscribe(result => {
      if (result && result.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cliente creado correctamente'
        });
        this.loadClients();
      }
    });
  }

  onEdit(row: any) {
    const ref = this.dialogService.open(ClientModalComponent, {
      data: {
        mode: 'Editar',
        client: row
      },
      header: 'Editar cliente',
      width: '500px',
      modal: true,
      dismissableMask: true,
    });
    
    ref.onClose.subscribe(result => {
      if (result && result.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cliente actualizado correctamente'
        });
        this.loadClients();
      }
    });
  }

  onDelete(row: any) {
    const ref = this.dialogService.open(ConfirmModalComponent, {
      data: {
        detailsCupo: {
          title: "¿Está seguro de eliminar a:",
          start: row.userFirstName + " " + row.userLastName,
        },
      },
      width: '400px',
      modal: true,
      dismissableMask: false,
    });

    ref.onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.clientService.deleteClient(row.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cliente eliminado correctamente'
            });
            this.loadClients();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el cliente'
            });
          }
        });
      }
    });
  }

  viewHistory(row: any) {
    this.router.navigate(['/operation/client-history', row.id]);
  }
}
