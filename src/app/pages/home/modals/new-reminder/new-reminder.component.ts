import { Component, OnInit } from '@angular/core';
import {RadioButtonModule} from "primeng/radiobutton";
import {SelectModule} from "primeng/select";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {DatePickerModule} from "primeng/datepicker";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ReminderService} from "../../../../services/reminder.service";
import {ClientService} from "../../../../services/client-managament/client.service";
import {ReminderRequestDTO} from "../../../../models/reminder.model";

@Component({
  selector: 'app-new-reminder',
  imports: [RadioButtonModule,SelectModule,CommonModule,FormsModule,InputTextModule, InputNumberModule, DatePickerModule],
  templateUrl: './new-reminder.component.html',
  styleUrl: './new-reminder.component.css'
})
export class NewReminderComponent implements OnInit {

  selectedOption: any = null;
  clientSelected: any = null;
  serviceSelected: any = null;
  description: string = "";
  sendDateTime: Date | null = null;
  loading: boolean = false;

  options: any[] = [
    { name: 'Si', key: true },
    { name: 'No', key: false },
  ];

  clients: any[] = [];
  
  services: any[] = [
    { label: 'Telefonía', value: 'Telefonia' },
    { label: 'Internet', value: 'Internet' },
    { label: 'TV', value: 'TV' }
  ];

  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private reminderService: ReminderService,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients.map(client => ({
          label: `${client.userFirstName} ${client.userLastName}`,
          value: client.id,
          data: client
        }));
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  guardar() {
    if (!this.clientSelected || !this.serviceSelected || !this.sendDateTime) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    // Validar que la fecha sea futura (con margen de 1 minuto)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // Añadir 1 minuto de margen
    if (this.sendDateTime <= now) {
      alert('La fecha y hora de envío debe ser al menos 1 minuto en el futuro');
      return;
    }

    this.loading = true;

    const reminderRequest: ReminderRequestDTO = {
      clientId: this.clientSelected,
      sendDateTime: this.sendDateTime.toISOString(),
      typeService: this.serviceSelected,
      description: this.description || '',
      isDebtor: this.selectedOption || false
    };

    this.reminderService.createReminder(reminderRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.ref.close(response);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating reminder:', error);
        alert('Error al crear el recordatorio. Por favor, intente nuevamente.');
      }
    });
  }

  getMinDate(): Date {
    return new Date();
  }

  cancelar() {
    this.ref.close(false);
  }

}
