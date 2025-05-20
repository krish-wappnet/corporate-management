import api from '../services/api';
import type { 
  Okr, 
  CreateOkrDto, 
  UpdateOkrDto, 
  KeyResult, 
  CreateKeyResultDto, 
  UpdateKeyResultDto, 
  KeyResultUpdate, 
  CreateKeyResultUpdateDto,
  OkrFilterParams 
} from '../types/okr';
import type { PaginatedResponse } from '../types/common';

const API_URL = '/okrs';

export const okrApi = {
  // OKR endpoints
  getOkrs: async (params?: OkrFilterParams): Promise<PaginatedResponse<Okr>> => {
    const response = await api.get(API_URL, { params });
    return response.data;
  },

  getOkrById: async (id: string): Promise<Okr> => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  createOkr: async (data: CreateOkrDto): Promise<Okr> => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  updateOkr: async (id: string, data: UpdateOkrDto): Promise<Okr> => {
    const response = await api.patch(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteOkr: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  },

  // Key Result endpoints
  createKeyResult: async (okrId: string, data: Omit<CreateKeyResultDto, 'okrId'>): Promise<KeyResult> => {
    const response = await api.post(`${API_URL}/${okrId}/key-results`, data);
    return response.data;
  },

  updateKeyResult: async (id: string, data: UpdateKeyResultDto): Promise<KeyResult> => {
    const response = await api.patch(`${API_URL}/key-results/${id}`, data);
    return response.data;
  },

  deleteKeyResult: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/key-results/${id}`);
  },

  // Key Result Update endpoints
  createKeyResultUpdate: async (data: CreateKeyResultUpdateDto): Promise<KeyResultUpdate> => {
    const response = await api.post(`${API_URL}/key-results/updates`, data);
    return response.data;
  },

  getKeyResultUpdates: async (keyResultId: string): Promise<KeyResultUpdate[]> => {
    const response = await api.get(`${API_URL}/key-results/${keyResultId}/updates`);
    return response.data;
  },

  // Analytics endpoints
  getCompletionRate: async (userId?: string) => {
    const response = await api.get(`${API_URL}/analytics/completion-rate`, {
      params: { userId }
    });
    return response.data;
  },

  getUserProgress: async (userId: string) => {
    const response = await api.get(`${API_URL}/analytics/user-progress/${userId}`);
    return response.data;
  },
};
