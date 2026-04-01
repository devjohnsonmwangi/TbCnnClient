import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../config/api.config';

export interface SystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  category: string;
  message: string;
  details?: string | null;
  error?: string | null;
  userId?: string | null;
  resourceId?: string | null;
  resourceType?: string | null;
  ipAddress?: string | null;
  responseTimeMs?: number | null;
  statusCode?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogsResponse {
  data: SystemLog[];
  total: number;
  limit: number;
  offset: number;
}

const getApiInstance = (): AxiosInstance => {
  const baseURL = API_BASE_URL;
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export class LogsService {
  private api: AxiosInstance;

  constructor() {
    this.api = getApiInstance();
  }

  async getLogs(options?: {
    level?: string;
    category?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<LogsResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();

      if (options?.level) params.append('level', options.level);
      if (options?.category) params.append('category', options.category);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());
      if (options?.search) params.append('search', options.search);

      const response = await this.api.get('/logs', {
        params: Object.fromEntries(params),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      console.error('Failed to fetch logs:', error);
      return { data: [], total: 0, limit: 0, offset: 0 };
    }
  }

  async getRecentLogs(): Promise<SystemLog[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await this.api.get('/logs/recent', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      console.error('Failed to fetch recent logs:', error);
      return [];
    }
  }

  async getErrorLogs(
    limit: number = 50,
    offset: number = 0
  ): Promise<LogsResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await this.api.get('/logs/errors', {
        params: { limit, offset },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      console.error('Failed to fetch error logs:', error);
      return { data: [], total: 0, limit: 0, offset: 0 };
    }
  }

  async getAuditLogs(
    limit: number = 50,
    offset: number = 0
  ): Promise<LogsResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await this.api.get('/logs/audit', {
        params: { limit, offset },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      console.error('Failed to fetch audit logs:', error);
      return { data: [], total: 0, limit: 0, offset: 0 };
    }
  }
}
