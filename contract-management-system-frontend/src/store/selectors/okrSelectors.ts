import type { RootState } from '../store';

interface KeyResult {
  id: string;
  [key: string]: any;
}

interface KeyResultUpdate {
  keyResultId: string;
  [key: string]: any;
}

export const selectKeyResultById = (state: RootState, id: string): KeyResult | undefined => {
  return state.okrs.keyResults?.find((kr: KeyResult) => kr.id === id);
};

export const selectKeyResultUpdates = (state: RootState, keyResultId: string): KeyResultUpdate[] => {
  return state.okrs.keyResultUpdates?.filter((update: KeyResultUpdate) => 
    update.keyResultId === keyResultId
  ) || [];
};
