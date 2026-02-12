// User and Auth types
export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'HR' | 'DRIVER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

// Driver types
export interface Driver {
  id?: number;
  name: string;
  email: string;
  cabType: string;
  available?: boolean;
}

// Booking types
export interface Booking {
  id?: number;
  employeeName: string;
  pickup: string;
  dropLocation: string;
  pickupTime: string;
  cabType: string;
  bookingDate?: string;
  status?: string;
  hrEmail: string;
  driverEmail?: string;
  createdAt?: string;
  durationMin: number;
  completed?: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (user: User) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
