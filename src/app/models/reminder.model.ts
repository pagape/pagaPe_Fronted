export interface Reminder {
  id?: number;
  reminderName: string;
  description: string;
  debtorFilter: boolean;
  relativeDays: number;
  scheduledDate: string;
  companyWhatsappNumber: string;
  status: ReminderStatus;
  serviceFilter?: ServiceFilter;
  selectedContracts?: ContractInfo[];
}

export interface ReminderRequest {
  reminderName: string;
  description: string;
  debtorFilter: boolean;
  serviceIdFilter?: number;
  relativeDays: number;
  scheduledDate: string;
  companyWhatsappNumber: string;
}

export interface ServiceFilter {
  id: number;
  nombreServicio: string;
}

export interface ContractInfo {
  id: number;
  amount: number;
  dueDate: string;
  client: ClientInfo;
}

export interface ClientInfo {
  id: number;
  userFirstName: string;
  userLastName: string;
  userPhone: string;
}

export interface ProcessReminderResponse {
  timestamp: string;
  message: string;
  messagesGenerated: number;
  data: ProcessedMessage[];
}

export interface ProcessedMessage {
  nombre: string;
  numero: string;
  servicio: string;
  monto: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo: 'deuda' | 'recordatorio';
  conversation_id: number;
}

export enum ReminderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}