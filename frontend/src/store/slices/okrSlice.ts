import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../rootReducer';
import api from '../../services/api';

interface KeyResult {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  progress: number;
  status: 'on_track' | 'at_risk' | 'off_track' | 'completed';
  dueDate: string;
}

interface OKR {
  id: string;
  title: string;
  description: string;
  type: 'company' | 'department' | 'individual';
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  progress: number;
  userId: string;
  keyResults: KeyResult[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface OKRState {
  okrs: OKR[];
  currentOKR: OKR | null;
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: OKRState = {
  okrs: [],
  currentOKR: null,
  loading: false,
  error: null,
  total: 0,
};

// Async thunks
export const fetchOKRs = createAsyncThunk(
  'okrs/fetchOKRs',
  async (
    {
      page = 1,
      limit = 10,
      userId,
      status,
      type,
    }: {
      page?: number;
      limit?: number;
      userId?: string;
      status?: string;
      type?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get('/okrs', {
        params: { page, limit, userId, status, type },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch OKRs'
      );
    }
  }
);

export const fetchOKRById = createAsyncThunk(
  'okrs/fetchOKRById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/okrs/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch OKR'
      );
    }
  }
);

export const createOKR = createAsyncThunk(
  'okrs/createOKR',
  async (okrData: Partial<OKR>, { rejectWithValue }) => {
    try {
      const response = await api.post('/okrs', okrData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create OKR'
      );
    }
  }
);

export const updateOKR = createAsyncThunk(
  'okrs/updateOKR',
  async (
    { id, okrData }: { id: string; okrData: Partial<OKR> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/okrs/${id}`, okrData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update OKR'
      );
    }
  }
);

const okrSlice = createSlice({
  name: 'okrs',
  initialState,
  reducers: {
    clearCurrentOKR: (state) => {
      state.currentOKR = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch OKRs
    builder.addCase(fetchOKRs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchOKRs.fulfilled,
      (state, action: PayloadAction<{ items: OKR[]; total: number }>) => {
        state.loading = false;
        state.okrs = action.payload.items;
        state.total = action.payload.total;
      }
    );
    builder.addCase(fetchOKRs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch OKR By Id
    builder.addCase(fetchOKRById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchOKRById.fulfilled,
      (state, action: PayloadAction<OKR>) => {
        state.loading = false;
        state.currentOKR = action.payload;
      }
    );
    builder.addCase(fetchOKRById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create OKR
    builder.addCase(createOKR.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOKR.fulfilled, (state, action: PayloadAction<OKR>) => {
      state.loading = false;
      state.okrs.unshift(action.payload);
      state.total += 1;
    });
    builder.addCase(createOKR.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update OKR
    builder.addCase(updateOKR.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateOKR.fulfilled,
      (state, action: PayloadAction<OKR>) => {
        state.loading = false;
        const index = state.okrs.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.okrs[index] = action.payload;
        }
        if (state.currentOKR?.id === action.payload.id) {
          state.currentOKR = action.payload;
        }
      }
    );
    builder.addCase(updateOKR.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentOKR, clearError } = okrSlice.actions;

export const selectOKRs = (state: RootState) => state.okrs.okrs;
export const selectCurrentOKR = (state: RootState) => state.okrs.currentOKR;
export const selectOKRsLoading = (state: RootState) => state.okrs.loading;
export const selectOKRsError = (state: RootState) => state.okrs.error;
export const selectTotalOKRs = (state: RootState) => state.okrs.total;

export default okrSlice.reducer;
