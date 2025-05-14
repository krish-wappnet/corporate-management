import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../rootReducer';
import api, { setToken } from '../../services/api';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Helper function to check if token is expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

// Try to get token from localStorage
const token = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user');

// Set auth token in API service if it exists
if (token) {
  try {
    setToken(token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
}

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: token,
  isAuthenticated: !!token && !isTokenExpired(token),
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (!response.data.access_token || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      const { access_token, user } = response.data;
      
      // Update token in API service and localStorage
      setToken(access_token);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        user,
        access_token
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    { 
      firstName, 
      lastName, 
      email, 
      password, 
      position, 
      department 
    }: { 
      firstName: string; 
      lastName: string; 
      email: string; 
      password: string;
      position?: string;
      department?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/register', { 
        firstName, 
        lastName, 
        email, 
        password,
        ...(position && { position }),
        ...(department && { department })
      });
      
      if (!response.data.access_token || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      const { access_token, user } = response.data;
      
      // Update token in API service and localStorage
      setToken(access_token);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        user,
        access_token
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

export const loadUser = createAsyncThunk<User, void, { state: RootState }>(
  'auth/loadUser',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const { token } = getState().auth;
    
    // Check if token exists and is not expired
    if (!token || isTokenExpired(token)) {
      dispatch(logout());
      return rejectWithValue('Session expired. Please log in again.');
    }
    
    try {
      // Set the token in the API service
      setToken(token);
      
      // Get user data from localStorage (set during login)
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found');
      }
      
      const user = JSON.parse(userData);
      return user as User;
      
    } catch (error: any) {
      console.error('Error loading user:', error);
      // Clear invalid credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken('');
      return rejectWithValue('Failed to load user data. Please log in again.');
    }
  }
);

// Logout action
export const logout = createAsyncThunk<boolean, void, { state: RootState }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Call logout API if needed
      // await api.post('/auth/logout');
      
      // Clear auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear the token from the API service
      setToken('');
      
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to log out');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Load User
    builder.addCase(loadUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      // Update localStorage with fresh user data
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    });
    builder.addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload as string;
      // Clear invalid credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
    
    // Rest of the reducers
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.access_token; // Changed from token to access_token
      state.error = null;
      
      // Set the token in the API service
      if (action.payload.access_token) {
        setToken(action.payload.access_token);
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload as string;
      // Clear localStorage on login failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken('');
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.access_token; // Changed from token to access_token
      state.error = null;
      
      // Set the token in the API service
      if (action.payload.access_token) {
        setToken(action.payload.access_token);
      }
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload as string;
      // Clear localStorage on registration failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken('');
    });
  },
});

// Export actions
export const { clearError } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
