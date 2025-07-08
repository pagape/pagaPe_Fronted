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
import { CountryCodeService } from "../../../services/country-code.service";
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
  filterTimeout: any;

  // Estos son los datos filtrados que envías al app-table
  data: Client[] = [];

  status: boolean = true;

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
    { field: 'formattedPhone', header: 'Número' },
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
    private countryCodeService: CountryCodeService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.getAllClients().subscribe({
      next: (response) => {
        // La respuesta de la API tiene el formato: { clients: Client[], totalClients: number, timestamp: string, message: string }
        if (response && response.clients) {
          this.allClients = response.clients;
        } else if (Array.isArray(response)) {
          // Fallback si la respuesta es directamente un array
          this.allClients = response;
        } else {
          this.allClients = [];
        }
        
        console.log('Clientes cargados:', this.allClients.length, this.allClients);
        
        // Aplicar filtros iniciales (por defecto solo activos)
        this.executeFilters();
        
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'No se pudieron cargar los clientes'
        });
        this.isLoading = false;
      }
    });
  }

  formatPhoneForDisplay(phone: string): string {
    if (!phone) return phone;
    
    // Parsear el número desde la base de datos
    const phoneData = this.countryCodeService.parsePhoneFromDatabase(phone);
    
    if (phoneData.country && phoneData.phoneNumber) {
      return this.countryCodeService.formatForDisplay(phoneData.phoneNumber, phoneData.country);
    }
    
    return phone; // Fallback al número original si no se puede parsear
  }

  applyFilters() {
    // Limpiar timeout anterior si existe
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    // Debounce para búsqueda de texto
    this.filterTimeout = setTimeout(() => {
      this.executeFilters();
    }, 300);
  }

  executeFilters() {
    this.isLoading = true;
    let filtered = [...this.allClients];

    // Aplicar filtro de texto localmente si hay búsqueda (solo nombres y apellidos)
    if (this.searchText && this.searchText.trim() !== '') {
      const search = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const firstName = (item.userFirstName || '').toLowerCase();
        const lastName = (item.userLastName || '').toLowerCase();
        
        return firstName.includes(search) || lastName.includes(search);
      });
    }

    // Aplicar filtro de estado
    if (this.status !== null && this.status !== undefined) {
      filtered = filtered.filter(item => item.active === this.status);
    }

    // Aplicar filtro de fecha
    if (this.dateRange?.length === 2) {
      const [start, end] = this.dateRange;
      
      // Configurar las fechas para comparación completa del día
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0); // Inicio del día
      
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999); // Final del día
      
      filtered = filtered.filter(item => {
        const createdDate = new Date(item.created);
        return createdDate >= startDate && createdDate <= endDate;
      });
    }

    // Formatear números de teléfono para los datos filtrados
    this.data = filtered.map((client: Client) => ({
      ...client,
      formattedPhone: this.formatPhoneForDisplay(client.userPhone)
    }));

    console.log('Filtros aplicados:', {
      searchText: this.searchText,
      status: this.status,
      dateRange: this.dateRange,
      totalClients: this.allClients.length,
      filteredClients: this.data.length
    });

    // Debug específico para fechas
    if (this.dateRange?.length === 2) {
      console.log('Filtro de fecha:', {
        fechaInicio: this.dateRange[0],
        fechaFin: this.dateRange[1],
        esMismoDia: this.dateRange[0].toDateString() === this.dateRange[1].toDateString()
      });
    }

    this.isLoading = false;
  }

  // Método para filtros inmediatos (sin debounce)
  applyFiltersImmediate() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.executeFilters();
  }

  // Debug temporal
  onSearchDebug() {
    console.log('Texto de búsqueda:', this.searchText);
  }


  clearFilters() {
    this.searchText = '';
    this.dateRange = undefined;
    this.status = true; // Por defecto activos
    this.serviceSelected = null;
    this.applyFiltersImmediate();
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
              detail: 'Cliente desactivado correctamente'
            });
            this.loadClients();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'No se pudo desactivar el cliente'
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
