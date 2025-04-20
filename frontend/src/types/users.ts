export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: string;
  backendToken?: string;
}
