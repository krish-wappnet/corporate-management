import api from './api';
import type { 
  Kpi, 
  KpiUpdate, 
  KpiCategory, 
  CreateKpiDto, 
  UpdateKpiDto, 
  CreateKpiUpdateDto,
  KpiFilterParams,
  PaginationParams,
  PaginatedResponse
} from '../types/kpi';

const API_BASE_URL = '/kpis';

// Helper function to build query string from params
const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  
  return queryParams.toString();
};

// KPI Endpoints
export const kpiApi = {
  // KPI CRUD Operations
  async getAllKpis(
    pagination: PaginationParams = { page: 1, limit: 10 },
    filters: KpiFilterParams = {}
  ): Promise<PaginatedResponse<Kpi>> {
    const query = buildQueryString({
      ...pagination,
      ...filters,
    });
    const response = await api.get<PaginatedResponse<Kpi>>(
      `${API_BASE_URL}?${query}`
    );
    return response.data;
  },

  getKpiById: async (id: string): Promise<Kpi> => {
    const response = await api.get<Kpi>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  createKpi: async (kpiData: CreateKpiDto): Promise<Kpi> => {
    const response = await api.post<Kpi>(API_BASE_URL, kpiData);
    return response.data;
  },

  updateKpi: async (id: string, kpiData: UpdateKpiDto): Promise<Kpi> => {
    const response = await api.put<Kpi>(`${API_BASE_URL}/${id}`, kpiData);
    return response.data;
  },

  deleteKpi: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE_URL}/${id}`);
  },

  // KPI Updates
  createKpiUpdate: async (updateData: CreateKpiUpdateDto): Promise<KpiUpdate> => {
    const response = await api.post<KpiUpdate>(
      `${API_BASE_URL}/${updateData.kpiId}/updates`,
      updateData
    );
    return response.data;
  },

  getKpiUpdates: async (kpiId: string): Promise<KpiUpdate[]> => {
    const response = await api.get<KpiUpdate[]>(
      `${API_BASE_URL}/${kpiId}/updates`
    );
    return response.data;
  },

  // KPI Categories
  getAllCategories: async (): Promise<KpiCategory[]> => {
    const response = await api.get<KpiCategory[]>(`${API_BASE_URL}/categories`);
    return response.data;
  },

  getCategoryById: async (id: string): Promise<KpiCategory> => {
    const response = await api.get<KpiCategory>(`${API_BASE_URL}/categories/${id}`);
    return response.data;
  },

  createCategory: async (name: string, description?: string): Promise<KpiCategory> => {
    const response = await api.post<KpiCategory>(`${API_BASE_URL}/categories`, {
      name,
      description,
    });
    return response.data;
  },

  updateCategory: async (id: string, name: string, description?: string): Promise<KpiCategory> => {
    const response = await api.put<KpiCategory>(`${API_BASE_URL}/categories/${id}`, {
      name,
      description,
    });
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE_URL}/categories/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Analytics
  getKpiCompletionRate: async (userId?: string): Promise<{
    total: number;
    completed: number;
    rate: number;
  }> => {
    const query = userId ? `?userId=${userId}` : '';
    const response = await api.get(`${API_BASE_URL}/analytics/completion-rate${query}`);
    return response.data;
  },

  getProgressByCategory: async (): Promise<Array<{ 
    category: string; 
    totalKpis: number; 
    avgProgress: number 
  }>> => {
    const response = await api.get(`${API_BASE_URL}/analytics/progress-by-category`);
    return response.data;
  },

  getKpiTrends: async (userId: string): Promise<any> => {
    const response = await api.get(`${API_BASE_URL}/analytics/trends?userId=${userId}`);
    return response.data;
  },
};

export default kpiApi;
