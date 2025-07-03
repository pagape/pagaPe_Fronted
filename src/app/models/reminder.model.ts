export interface ReminderRequestDTO {
  clientId: number; // Required: Must be a valid existing client ID
  sendDateTime: string; // Required: ISO format "yyyy-MM-ddTHH:mm:ss", must be future date
  typeService: string; // Required: Type of service for the reminder
  description?: string; // Optional: Custom description for the reminder
  isDebtor?: boolean; // Optional: If not provided, system auto-detects based on client due date
}

export interface ReminderResponseDTO {
  id: number;
  description: string;
  sendDateTime: string; // ISO format
  responseStatus: 'PENDIENTE' | 'ENVIADO' | 'ERROR_DE_ENVIO' | 'ENTREGADO' | 'LEIDO';
  typeService: string;
  clientWhatsappPhoneNumber: string;
  isDebtor: boolean;
  clientId: number;
  clientName: string;
}

export interface ReminderStatusUpdateDTO {
  status: 'PENDIENTE' | 'ENVIADO' | 'ERROR_DE_ENVIO' | 'ENTREGADO' | 'LEIDO';
}

// Type definitions for commonly used service types
export type ReminderServiceType = 
  | 'PAYMENT_REMINDER'
  | 'DEBT_REMINDER' 
  | 'FOLLOW_UP'
  | 'Telefonia'
  | 'Internet'
  | 'TV';

export type ReminderStatus = 
  | 'PENDIENTE'      // Reminder pending to be sent
  | 'ENVIADO'        // Reminder sent successfully
  | 'ERROR_DE_ENVIO' // Error occurred while sending
  | 'ENTREGADO'      // Message delivered to client
  | 'LEIDO';         // Message read by client

// Error response interface for API errors
export interface ReminderErrorResponse {
  timestamp: string;
  message: string;
  error: string;
  details?: { [key: string]: string };
}