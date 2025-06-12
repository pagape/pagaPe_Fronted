import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ClientService } from '../../../../services/client.service';
import {Client, ClientRequest} from '../../../../models/client.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-client-modal',
  imports: [FormsModule, CommonModule, InputNumberModule, InputTextModule, ButtonModule, ToastModule],
  templateUrl: './client-modal.component.html',
  styleUrl: './client-modal.component.css',
  providers: [MessageService]
})
export class ClientModalComponent implements OnInit {
  name: string = "";
  lastname: string = "";
  email: string = "";
  number: string = "";
  clientId: number | null = null;
  isEditing: boolean = false;
  showError: boolean = false;
  errorMessage: string = "";
  isLoading: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private clientService: ClientService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.isEditing = this.config.data.mode === 'Editar';

    if (this.isEditing && this.config.data.client) {
      const client = this.config.data.client;
      this.clientId = client.id;
      this.name = client.userFirstName;
      this.lastname = client.userLastName;
      this.email = client.userEmail || '';
      this.number = client.userPhone || '';
    }
  }

  guardar() {
    this.showError = false;
    this.isLoading = true;

    const clientData: ClientRequest = {
      userFirstName: this.name,
      userLastName: this.lastname,
      userEmail: this.email,
      userPhone: this.number,
      active: true
    };

    if (this.isEditing && this.clientId) {

      this.clientService.updateClient(this.clientId, clientData).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.ref.close({
            success: true,
            data: result
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    } else {
      // Crear nuevo cliente
      this.clientService.createClient(clientData).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.ref.close({
            success: true,
            data: result
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    }
  }

  cancelar() {
    this.ref.close({
      success: false
    });
  }

  private handleError(error: any) {
    this.showError = true;

    if (error.status === 400 && error.message.includes('número de teléfono')) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo.';
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage
    });
  }
}
