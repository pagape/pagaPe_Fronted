export interface Client {
  id?: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPhone: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
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