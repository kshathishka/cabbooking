import axios from 'axios';
import type { User, LoginRequest, LoginResponse, Driver, Booking } from '../types';

// Configure base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (user: User): Promise<string> => {
    const response = await api.post('/auth/register', user);
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/admin/bookings');
    return response.data;
  },

  getDrivers: async (): Promise<Driver[]> => {
    const response = await api.get<Driver[]>('/admin/view-drivers');
    return response.data;
  },

  addDriver: async (driver: Driver): Promise<string> => {
    const response = await api.post('/admin/add-driver', driver);
    return response.data;
  },
};

// HR API
export const hrAPI = {
  createBooking: async (booking: Booking): Promise<string> => {
    const response = await api.post('/hr/book', booking);
    return response.data;
  },

  getMyBookings: async (email: string): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/hr/mybookings', {
      params: { email },
    });
    return response.data;
  },
};

// Driver API
export const driverAPI = {
  getMyTrips: async (email: string): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/driver/mytrips', {
      params: { email },
    });
    return response.data;
  },

  completeTrip: async (bookingId: number): Promise<string> => {
    const response = await api.put(`/driver/complete-trip/${bookingId}`);
    return response.data;
  },
};

export default api;
