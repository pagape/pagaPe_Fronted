import {Component, OnInit} from '@angular/core';
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
import {SharedFormComponent} from "../../../components/modals/shared-form/shared-form.component";
import {ClientService} from "../../../services/client-managament/client.service";
import {MessageService} from "primeng/api";
import {ClientServiceService} from "../../../services/client-managament/client-service.service";
import {ServiceService} from "../../../services/client-managament/service.service";

@Component({
  selector: 'app-list-client-services',
  imports: [CommonModule,FormsModule, SelectModule,DatePickerModule,InputTextModule,ButtonModule,TableComponent],
  templateUrl: './list-client-services.component.html',
  styleUrl: './list-client-services.component.css',
  providers:[DialogService]
})
export class ListClientServicesComponent implements OnInit{
  searchText: string = '';
  dateStart: Date | undefined;
  dateEnd: Date | undefined;
  
  clients: any[] = [];
  allClientServices: any[] = []; // Para almacenar todos los datos sin filtrar
  isLoading: boolean = false;

  servicios: any[]=[]

  fields:any[]= [
    {
      label: 'Cliente',
      name: 'clientId',
      type: 'autocomplete',
      required: true,
      placeholder: 'Ingrese el nombre',
      displayField: 'userFirstName',
      options: this.clients

    },
    {
      label: 'Tipo de Servicio',
      name: 'serviceId',
      type: 'select',
      required: true,
      displayField: 'nombreServicio',
      options: this.servicios
    },
    {
      label: 'Fecha registro',
      name: 'fechaRegistro',
      type: 'datePicker',
      required: true,
      selectionMode: 'range',
      placeholder: 'Seleccione un rango de fechas'
    },

    {
      label: 'Periodicidad de pago:',
      name: 'paymentFrequency',
      type: 'select',
      required: true,
      options: [
        { id: 'QUINCENAL', name: 'quincenal' },
        { id: 'FIN_DE_MES', name: 'mensual' },

      ]
    },

    {
      label: 'Monto',
      name: 'amount',
      type: 'number',
      required: true,
      placeholder: 'Ingrese el monto'
    }
  ];


  actions = [

    {icon: 'edit_square', action: (row: any) => this.onEdit(row)},
    {icon: 'delete_forever', action: (row: any) => this.onDelete(row)}


  ];
  columns = [
    {field: 'id', header: 'Nro.'},
    {field: 'nombreCliente', header: 'Nombre'},
    {field: 'apellidoCliente', header: 'Apellido'},
    {field: 'nombreServicio', header: 'Tipo de servicio'},
    {field: 'issueDate', header: 'Fecha de inicio'},
    {field: 'dueDate', header: 'Fecha de fin'},
    {field: 'paymentFrequency', header: 'Fecha de pago'},
    {field: 'amount', header: 'Monto'},
    {
      field: 'active',
      header: 'Estado',
      type: 'tag',
      colorMap: {Activo: 'green', Inactivo: 'red', Pendiente: 'orange'},
    },
    {
      field: 'actions',
      header: 'Opciones',
      type: 'actions',
      actions: this.actions,
    },

  ];


  data = [
    {
      nro: 1,
      name: 'Mario',
      lastname: 'Gutierrez',
      service: 'Telefonia',
      dateS: '10/05/2025 ',
      dateE: '10/10/2026 ',
      dateP: 'quincena',
      monto: 'S/29.90',
      status: 'Activo',
      state: 'A'
    },
    {
      nro: 2,
      name: 'Juan',
      lastname: 'Diaz',
      service: 'TV',
      dateS: '10/03/2025 ',
      dateE: '01/04/2026 ',
      dateP: 'mensual',
      status: 'Activo',
      monto: 'S/50.00',
      state: 'A'
    },
    {
      nro: 3,
      name: 'Isabel',
      lastname: 'Rosales',
      service: 'Internet',
      dateS: '10/02/2025 ',
      dateE: '10/03/2026 ',
      dateP: 'quincena',
      monto: 'S/20.00',
      status: 'Activo',
      state: 'A'
    },
  ];
  ref: DynamicDialogRef | undefined;
  services: any[] = [];

  serviceSelected: any = null;

  constructor(private router: Router, private messageService: MessageService,public serviceService: ServiceService, public clientService: ClientService,public service:ClientServiceService,public dialogService: DialogService, private route: ActivatedRoute) {

    this.loadClients();
  }

  ngOnInit() {

    this.loadData();
    this.loadClients();
    this.loadService();
  }

  loadData() {
    this.isLoading = true;
    this.service.getAllClientServices().subscribe({
      next: (clients) => {
        console.log('Respuesta cruda:', clients);

        // Almacenar todos los datos sin filtrar
        this.allClientServices = clients.map(client => ({
          ...client,
          nombreCliente: client.client?.userFirstName ?? '',
          apellidoCliente: client.client?.userLastName ?? '',
          nombreServicio: client.service?.nombreServicio ?? ''
        }));

        console.log('Datos normalizados:', this.allClientServices);
        
        // Aplicar filtros iniciales
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los servicios del cliente'
        });
        this.isLoading = false;
      }
    });
  }


  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (response) => {
        console.log('API Response:', response)
        // Check if response has clients property (API returns object with clients array)
        if (response && response.clients) {
          this.clients = response.clients;
        } else if (Array.isArray(response)) {
          // If it's directly an array
          this.clients = response;
        } else {
          console.error('Unexpected response format:', response);
          this.clients = [];
        }
        this.fields[0].options = this.clients;
        console.log('Clients array:', this.clients)
        console.log("los field: "+ this.fields[0].options)

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes'
        });
        this.clients = [];
      }
    });


    return this.clients;
  }

  loadService() {
    this.serviceService.getAllServices().subscribe({
      next: (s) => {
        console.log('Servicios del backend:', s)
        this.servicios = s;
        this.fields[1].options = s;
        
        // Llenar el array services para el filtro con los nombres de servicios
        this.services = s.map((servicio: any) => servicio.nombreServicio);
        
        console.log('Servicios para filtro:', this.services)

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los servicios'
        });

      }
    });

  }


  handleClientServiceAdded(newUser: any): void {
    console.log(newUser);
    this.service.createClientService(newUser).subscribe({
      next: (data) => {
        console.log('creado con éxito:', data);
        //this.();

      },
      error: (err) => {
        console.error('Error al crear el usuario:', err);
      }
    });
  }

  handleClientServiceSet(id:number,newUser: any): void {
    console.log(newUser);
    newUser.active = true
    console.log(newUser);
    this.service.updateClientService(id, newUser).subscribe({
      next: (updatedUser) => {
        console.log('Usuario actualizado:', updatedUser);
       // this.loadUsers();
      },
      error: (err) => {
        console.error('Error actualizando usuario:', err);
      }
    });
  }

  create() {
      const ref = this.dialogService.open(ClientServiceModalComponent, {
        data: {
          name: 'Crear',         // indica que es modo edición
        },
        modal: true,
        dismissableMask: true,
        width: '450px'
      });

      ref.onClose.subscribe(result => {
        if (result) {
          console.log('Edición completada:', result);
          // Recargar datos si lo deseas
          this.loadData(); // o loadServices, loadClients, etc.
        } else {
          console.log('Modal cerrado sin cambios');
        }
      });
    }


    onEdit(row: any) {
    const ref = this.dialogService.open(ClientServiceModalComponent, {
      data: {
        name: 'Editar',         // indica que es modo edición
        id: row.id,             // se puede usar para update
        initialData: row        // se usará para precargar el formulario
      },
      modal: true,
      dismissableMask: true,
      width: '450px'
    });

    ref.onClose.subscribe(result => {
      if (result) {
        console.log('Edición completada:', result);
        // Recargar datos si lo deseas
        this.loadData(); // o loadServices, loadClients, etc.
      } else {
        console.log('Modal cerrado sin cambios');
      }
    });
  }


  //
  onDelete(row: any) {
    const ref = this.dialogService.open(ConfirmModalComponent, {
      data: {
        detailsCupo: {
          title: "¿Está seguro de eliminar a:",
          start: row.nombreCliente + " " + row.apellidoCliente,
        },
      },
      width: '400px',
      modal: true,
      dismissableMask: false,
    });

    ref.onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.service.deleteClientService(row.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cliente eliminado correctamente'
            });
            this.loadData();
          },
          error: (error: any) => {
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

  // Métodos de filtrado
  applyFilters(): void {
    let filtered = [...this.allClientServices];

    // Filtro de texto (busca en nombre y apellido del cliente)
    if (this.searchText && this.searchText.trim() !== '') {
      const search = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const nombreCompleto = `${item.nombreCliente} ${item.apellidoCliente}`.toLowerCase();
        const servicio = (item.nombreServicio || '').toLowerCase();
        return nombreCompleto.includes(search) || servicio.includes(search);
      });
    }

    // Filtro de fecha (usando el mismo método que funcionó en clientes)
    if (this.dateStart && this.dateEnd) {
      filtered = filtered.filter(item => {
        if (!item.issueDate) return false;

        // Parsear fecha evitando problemas de zona horaria
        let clientDateString: string;
        if (item.issueDate.includes('-')) {
          const [year, month, day] = item.issueDate.split('-');
          clientDateString = `${parseInt(day)}/${parseInt(month)}/${year}`;
        } else {
          const createdDate = new Date(item.issueDate);
          if (isNaN(createdDate.getTime())) return false;
          clientDateString = createdDate.toLocaleDateString('es-ES');
        }

        const startDateString = this.dateStart!.toLocaleDateString('es-ES');
        const endDateString = this.dateEnd!.toLocaleDateString('es-ES');

        return this.isDateInRange(clientDateString, startDateString, endDateString);
      });
    }

    // Filtro de tipo de servicio
    if (this.serviceSelected) {
      filtered = filtered.filter(item => {
        return item.nombreServicio === this.serviceSelected;
      });
    }

    this.data = filtered;

    console.log('Filtros aplicados:', {
      searchText: this.searchText,
      dateStart: this.dateStart,
      dateEnd: this.dateEnd,
      serviceSelected: this.serviceSelected,
      totalItems: this.allClientServices.length,
      filteredItems: this.data.length
    });
  }

  // Método de comparación de fechas (mismo que en clientes)
  private isDateInRange(clientDateString: string, startDateString: string, endDateString: string): boolean {
    const parseSpanishDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };
    
    const clientDate = parseSpanishDate(clientDateString);
    const startDate = parseSpanishDate(startDateString);
    const endDate = parseSpanishDate(endDateString);
    
    return clientDate >= startDate && clientDate <= endDate;
  }

  // Limpiar filtros
  clearFilters(): void {
    this.searchText = '';
    this.dateStart = undefined;
    this.dateEnd = undefined;
    this.serviceSelected = null;
    this.applyFilters();
  }

}
