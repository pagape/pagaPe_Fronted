export interface ReminderRequestDTO {
  clientId: number;
  sendDateTime: string;
  typeService: string;
  description?: string;
  isDebtor?: boolean;
}

export interface ReminderResponseDTO {
  id: number;
  description: string;
  sendDateTime: string;
  responseStatus: 'PENDIENTE' | 'ENVIADO' | 'ERROR_DE_ENVIO';
  typeService: string;
  clientWhatsappPhoneNumber: string;
  isDebtor: boolean;
  clientId: number;
  clientName: string;
}

export interface ReminderStatusUpdateDTO {
  status: 'PENDIENTE' | 'ENVIADO' | 'ERROR_DE_ENVIO';
}