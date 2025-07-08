import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ClientHistory } from '../../../models/client.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client-managament/client.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule],
  template: `
    <div class="history-container">
      <p-toast position="top-right"></p-toast>

      <div class="history-header">
        <h3>Historial de modificaciones de {{ clientName }}</h3>
        <button *ngIf="!isStandalone" pButton type="button" icon="pi pi-times" class="p-button-rounded p-button-text" (click)="close()"></button>
      </div>

      <div *ngIf="isLoading" class="loading">
        <p>Cargando historial...</p>
      </div>

      <div *ngIf="!isLoading && noHistoryAvailable" class="no-history">
        <p>No hay historial de modificaciones para este cliente.</p>
      </div>

      <p-table *ngIf="!isLoading && !noHistoryAvailable"
               [value]="modificationsToShow"
               styleClass="p-datatable-sm"
               [tableStyle]="{'min-width': '50rem'}">
        <ng-template pTemplate="header">
          <tr>
            <th>Fecha</th>
            <th>Usuario</th>
            <th>Acción</th>
            <th>Detalles</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ item.user }}</td>
            <td>{{ item.action }}</td>
            <td>{{ item.details }}</td>
          </tr>
        </ng-template>
      </p-table>

      <div class="actions" *ngIf="isStandalone">
        <button pButton type="button" label="Volver" (click)="goBack()"></button>
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .no-history, .loading {
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .actions {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
    }

    h3 {
      margin-bottom: 0;
    }
  `],
  providers: [MessageService]
})
export class ClientHistoryComponent implements OnInit {
  history: ClientHistory | undefined;
  clientName: string = '';
  isLoading: boolean = false;
  isStandalone: boolean = false;
  clientId: number | null = null;
  noHistoryAvailable: boolean = true;
  modificationsToShow: any[] = [];

  constructor(
    public ref: DynamicDialogRef | null,
    public config: DynamicDialogConfig | null,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private messageService: MessageService
  ) {
    this.ref = ref;
    this.config = config;
  }

  ngOnInit() {
    // Determinar si el componente se carga como página independiente o como modal
    this.isStandalone = this.ref === null;

    if (this.isStandalone) {
      // Si es página independiente, obtener el ID del cliente de la URL
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.clientId = +params['id'];
          this.loadClientHistory(this.clientId);
        }
      });
    } else if (this.config && this.config.data && this.config.data.history) {
      // Si es modal, obtener el historial de los datos pasados al modal
      this.history = this.config.data.history;
      this.clientName = this.history?.clientName || 'Cliente';
      this.updateHistoryState();
    }
  }

  updateHistoryState() {
    this.noHistoryAvailable = !this.history || !this.history.modifications || this.history.modifications.length === 0;
    this.modificationsToShow = this.history?.modifications || [];
  }

  loadClientHistory(clientId: number) {
    this.isLoading = true;
    this.clientService.getClientHistory(clientId).subscribe({
      next: (history: any) => {
        this.history = history;
        this.clientName = history?.clientName || 'Cliente';
        this.updateHistoryState();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el historial del cliente'
        });
        this.isLoading = false;
        this.noHistoryAvailable = true;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  close() {
    if (this.ref) {
      this.ref.close();
    }
  }

  goBack() {
    this.router.navigate(['/operation/list-clients']);
  }
}
