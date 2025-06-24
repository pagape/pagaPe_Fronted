export interface User {
  email: string;
  role: string;
}

export interface UserInfo{
  id: number;
  userFirstName :string;
  userLastName: string;
  userEmail: string;
  userDNI:string;
  userPhone: string;
  imageData: string | null;
  role: string;
  lastLogin: string | null;
  active: boolean;
  userPassword?: string; // Opcional, solo para crear o actualizar
}
