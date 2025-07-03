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
import { ClientService } from "../../../services/client-managament/client.service";
import { Client } from "../../../models/client.model";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import {ToggleSwitchModule} from "primeng/toggleswitch";

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
    ToastModule,
    ToggleSwitchModule
  ],
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.css',
  providers: [DialogService, MessageService]
})
export class ListClientsComponent implements OnInit {
  searchText: string = '';
  dateRange: Date[] | undefined;
  isLoading: boolean = false;
  allClients: Client[] = [];

  // Estos son los datos filtrados que envías al app-table
  data: Client[] = [];

  status: boolean = false;

  actions = [
    { icon: 'edit_square', action: (row: any) => this.onEdit(row) },
    { icon: 'delete_forever', action: (row: any) => this.onDelete(row) },
  ];

  columns = [
    { field: 'id', header: 'Id' },
    { field: 'userFirstName', header: 'Nombre' },
    { field: 'userLastName', header: 'Apellido' },
    { field: 'created', header: 'Fecha de registro' },
    { field: 'userEmail', header: 'Correo' },
    { field: 'userPhone', header: 'Número' },
    {
      field: 'active',
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
        this.allClients = clients;  // cargamos copia original
        this.data = [...this.allClients];
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

  applyFilters() {
    let filtered = [...this.allClients];


    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(item =>
        item.userFirstName.toLowerCase().includes(search) ||
        item.userLastName.toLowerCase().includes(search) ||
        item.userEmail.toLowerCase().includes(search) ||
        item.userPhone.toLowerCase().includes(search)
      );
    }


    if (this.dateRange?.length === 2) {
      const [start, end] = this.dateRange;
      filtered = filtered.filter(item => {
        const createdDate = new Date(item.created);
        return createdDate >= start && createdDate <= end;
      });
    }


    if (this.status !== null) {
      filtered = filtered.filter(item => item.active === this.status);
    }

    this.data = filtered;
  }


  create() {
    const ref = this.dialogService.open(ClientModalComponent, {
      data: {
        mode: 'Crear'
      },
      header: 'Crear nuevo cliente',
      width: '650px',
      height: '80vh',
      modal: true,
      dismissableMask: true,
      styleClass: 'client-modal-large'
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
      width: '650px',
      height: '80vh',
      modal: true,
      dismissableMask: true,
      styleClass: 'client-modal-large'
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
              detail: `No se pudo eliminar el cliente: ${error.message || 'error desconocido'}`,
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
