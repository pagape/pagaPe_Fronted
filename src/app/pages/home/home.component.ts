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
import {NewReminderComponent} from "./modals/new-reminder/new-reminder.component";
import {ReminderService} from "../../services/client-managament/reminder.service";
import {Reminder} from "../../models/reminder.model";

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
  reminders: Reminder[] = [];
  loading: boolean = false;

  states = [
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '0' },
  ];

  actions = [

  ];
  
  columns = [
    { field: 'id', header: 'ID' },
    { field: 'reminderName', header: 'Nombre' },
    { field: 'description', header: 'Descripción' },
    { field: 'scheduledDate', header: 'Fecha programada' },
    {
      field: 'status',
      header: 'Estado',
      type: 'tag',
      colorMap: { 
        'PENDING': 'orange', 
        'PROCESSING': 'blue', 
        'COMPLETED': 'green', 
        'FAILED': 'red' 
      },
    },
  ];

  data: any[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private router: Router, 
    private authService: AuthService,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    private reminderService: ReminderService
  ) {
    console.log(this.authService.getUser())
  }

  ngOnInit(): void {
    this.loadReminders();
  }

  loadReminders(): void {
    this.loading = true;
    this.reminderService.getAllReminders().subscribe({
      next: (reminders) => {
        this.reminders = reminders;
        this.data = reminders.map(reminder => ({
          id: reminder.id,
          reminderName: reminder.reminderName,
          description: reminder.description,
          scheduledDate: this.formatDate(reminder.scheduledDate),
          status: reminder.status,
          relativeDays: reminder.relativeDays,
          debtorFilter: reminder.debtorFilter
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reminders:', error);
        this.loading = false;
      }
    });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
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
      width: '500px',
      height: 'auto',
      modal: true,
      dismissableMask: true,
      styleClass: 'responsive-dialog'
    });
    ref.onClose.subscribe(result => {
      if (result) {
        console.log('Recordatorio creado:', result);
        this.loadReminders(); // Recargar la lista después de crear un recordatorio
      } else {
        console.log('modal cerrado');
      }
    });
  }
}
