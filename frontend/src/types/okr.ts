export interface Okr {
  id: string;
  title: string;
  description?: string;
  type: 'individual' | 'team' | 'company' | 'department';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  userId: string;
  departmentId?: string;
  parentOkrId?: string;
  keyResults?: KeyResult[];
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOkrDto {
  title: string;
  description?: string;
  type: 'individual' | 'team' | 'company' | 'department';
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  departmentId?: string;
  parentOkrId?: string;
  keyResults?: Array<Omit<CreateKeyResultDto, 'okrId'>>;
}

export interface UpdateOkrDto extends Partial<CreateOkrDto> {}

export interface KeyResult {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  weight?: number;
  okrId: string;
  status: 'on_track' | 'at_risk' | 'off_track' | 'completed';
  updates?: KeyResultUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateKeyResultDto {
  title: string;
  description?: string;
  targetValue: number;
  currentValue?: number;
  unit: string;
  weight?: number;
  okrId: string;
}

export interface UpdateKeyResultDto extends Partial<CreateKeyResultDto> {
  status?: 'on_track' | 'at_risk' | 'off_track' | 'completed';
}

export interface KeyResultUpdate {
  id: string;
  keyResultId: string;
  userId: string;
  value: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKeyResultUpdateDto {
  keyResultId: string;
  value: number;
  comment?: string;
}

export interface OkrFilterParams {
  status?: string;
  type?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}
