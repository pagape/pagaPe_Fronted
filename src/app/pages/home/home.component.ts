import { Component, OnInit } from '@angular/core';
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
import {ReminderService} from "../../services/reminder.service";
import {ReminderResponseDTO} from "../../models/reminder.model";
import {NewReminderComponent} from "./modals/new-reminder/new-reminder.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule, SelectModule,DatePickerModule,InputTextModule,ButtonModule,TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone:true,
  providers: [ DialogService],

})
export class HomeComponent implements OnInit {
  searchText: string = '';
  dateRange: Date[] | undefined;
  stateSelected: any;
  reminders: ReminderResponseDTO[] = [];
  filteredReminders: ReminderResponseDTO[] = [];
  loading: boolean = false;

  states = [
    { label: 'PENDIENTE', value: 'PENDIENTE' },
    { label: 'ENVIADO', value: 'ENVIADO' },
    { label: 'ERROR_DE_ENVIO', value: 'ERROR_DE_ENVIO' },
  ];

  actions = [];
  
  columns = [
    { field: 'id', header: 'Nro de Recordatorio' },
    { field: 'clientName', header: 'Nombre Cliente' },
    { field: 'description', header: 'Descripción' },
    { field: 'sendDateTime', header: 'Fecha de envío' },
    { field: 'typeService', header: 'Tipo de Servicio' },
    {
      field: 'responseStatus',
      header: 'Estado',
      type: 'tag',
      colorMap: { 
        'PENDIENTE': 'orange', 
        'ENVIADO': 'green', 
        'ERROR_DE_ENVIO': 'red' 
      },
    },
  ];

  data: any[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private reminderService: ReminderService,
    public dialogService: DialogService,
    private route: ActivatedRoute
  ) {
    console.log(this.authService.getUser())
  }

  ngOnInit() {
    this.loadReminders();
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

  loadReminders() {
    this.loading = true;
    this.reminderService.getAllReminders().subscribe({
      next: (reminders) => {
        this.reminders = reminders;
        this.filteredReminders = reminders;
        this.data = this.mapRemindersToTableData(reminders);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reminders:', error);
        this.loading = false;
      }
    });
  }

  private mapRemindersToTableData(reminders: ReminderResponseDTO[]): any[] {
    return reminders.map(reminder => ({
      id: reminder.id,
      clientName: reminder.clientName,
      description: reminder.description,
      sendDateTime: this.formatDate(reminder.sendDateTime),
      typeService: reminder.typeService,
      responseStatus: reminder.responseStatus,
      isDebtor: reminder.isDebtor,
      clientWhatsappPhoneNumber: reminder.clientWhatsappPhoneNumber
    }));
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  onDateRangeChange() {
    this.filterReminders();
  }

  onSearchChange() {
    this.filterReminders();
  }

  onStateChange() {
    this.filterReminders();
  }

  private filterReminders() {
    let filtered = [...this.reminders];

    if (this.searchText) {
      filtered = filtered.filter(reminder => 
        reminder.clientName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        reminder.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        reminder.typeService.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.stateSelected) {
      filtered = filtered.filter(reminder => 
        reminder.responseStatus === this.stateSelected
      );
    }

    if (this.dateRange && this.dateRange.length === 2 && this.dateRange[0] && this.dateRange[1]) {
      const startDate = new Date(this.dateRange[0]);
      const endDate = new Date(this.dateRange[1]);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter(reminder => {
        const reminderDate = new Date(reminder.sendDateTime);
        return reminderDate >= startDate && reminderDate <= endDate;
      });
    }

    this.filteredReminders = filtered;
    this.data = this.mapRemindersToTableData(filtered);
  }

  create() {
    const ref = this.dialogService.open(NewReminderComponent, {
      modal: true,
      dismissableMask: true,
    });
    ref.onClose.subscribe(result => {
      if (result) {
        console.log('Reminder created:', result);
        this.loadReminders();
      } else {
        console.log('modal cerrado');
      }
    });
  }
}
