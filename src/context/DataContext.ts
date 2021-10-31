import { createContext, useContext } from 'react';
import { DataState, initialState } from './Reducer';

export const DataContext = createContext<DataState>(initialState);
export const DataProvider = DataContext.Provider;

export function useData() {
  return useContext(DataContext);
}
