export interface Client {
  id?: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPhone: string;
  created: string;
  updatedAt?: string;
  updatedBy?: string;
  active?: boolean;
}

export interface ClientRequest {
  id?: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPhone: string;
  country?: string;
  amount: number;
  issueDate: string; // ISO date format
  dueDate: string;   // ISO date format
  paymentFrequency?: 'QUINCENAL' | 'FIN_DE_MES';
  active?: boolean;
}

export interface ClientHistoryItem {
  date: string;
  user: string;
  action: string;
  details: string;
}

export interface ClientHistory {
  clientId: number;
  clientName: string;
  modifications: ClientHistoryItem[];
}
