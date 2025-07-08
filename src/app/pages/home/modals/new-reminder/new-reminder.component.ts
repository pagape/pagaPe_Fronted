import { Component, OnInit } from '@angular/core';
import {RadioButtonModule} from "primeng/radiobutton";
import {SelectModule} from "primeng/select";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ReminderService} from "../../../../services/client-managament/reminder.service";
import {ServiceService} from "../../../../services/client-managament/service.service";
import {ReminderRequest} from "../../../../models/reminder.model";
import {Service} from "../../../../models/service.model";
import {NotificationService} from "../../../../services/notification.service";
import {DatePickerModule} from "primeng/datepicker";

@Component({
  selector: 'app-new-reminder',
  imports: [RadioButtonModule,DatePickerModule,SelectModule,CommonModule,FormsModule,InputTextModule, InputNumberModule],
  templateUrl: './new-reminder.component.html',
  styleUrl: './new-reminder.component.css'
})
export class NewReminderComponent implements OnInit {

  selectedOption: any = null;
  numberSelected: any = null;
  serviceSelected: any = null;

  scheduleDay:any=null;
  name: string = "";
  desc: string = "";
  peso: number = 0;
  loading: boolean = false;
  services: Service[] = [];

  options: any[] = [
    { name: 'Si', key: 'S' },
    { name: 'No', key: 'N' },
  ];

  numbers: any[] = [
    { label: '+51 999888777', value: '51999888777' }
  ];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private reminderService: ReminderService,
    private serviceService: ServiceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services.map(service => ({
          ...service,
          label: service.nombreServicio,
          value: service.id
        }));
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  guardar() {
    if (!this.isFormValid()) {
      this.showValidationErrors();
      return;
    }

    this.loading = true;

    // const scheduledDate = new Date();
    // scheduledDate.setDate(scheduledDate.getDate() + this.peso);

    const reminderRequest: ReminderRequest = {
      reminderName: this.name,
      description: this.desc,
      debtorFilter: this.selectedOption === 'S',
      serviceIdFilter: this.serviceSelected?.value || this.serviceSelected,
      relativeDays: this.peso,
      scheduledDate:this.scheduleDay.toISOString().split('T')[0],
      companyWhatsappNumber: this.numberSelected?.value || this.numberSelected
    };

    //console.log(reminderRequest);

    this.reminderService.createReminder(reminderRequest).subscribe({
      next: (response) => {
        console.log('Recordatorio creado exitosamente:', response);
        this.notificationService.success('Recordatorio creado exitosamente');
        this.ref.close(response);
      },
      error: (error) => {
        console.error('Error al crear recordatorio:', error);
        this.notificationService.error('Error al crear el recordatorio. Por favor intente nuevamente.');
        this.loading = false;
      }
    });
  }

  cancelar() {
    this.ref.close(false);
  }

  private showValidationErrors(): void {
    const errors: string[] = [];

    if (!this.name) {
      errors.push('Nombre es requerido');
    }

    if (!this.serviceSelected) {
      errors.push('Tipo de servicio es requerido');
    }

    if (!this.numberSelected) {
      errors.push('Número de WhatsApp es requerido');
    }

    if (this.selectedOption === null || this.selectedOption === undefined) {
      errors.push('Debe seleccionar si filtrar solo deudores');
    }

    if (this.peso < 0) {
      errors.push('La cantidad de días no puede ser negativa');
    }

    if (errors.length > 0) {
      this.notificationService.warning(
        `Por favor complete los siguientes campos: ${errors.join(', ')}`,
        6000
      );
    }
  }

  private isFormValid(): boolean {
    return !!(this.name &&
              this.serviceSelected &&
              this.selectedOption !== null &&
              this.numberSelected &&
              this.peso >= 0);
  }

}
