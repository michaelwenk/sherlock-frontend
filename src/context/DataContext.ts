import { createContext, useContext } from 'react';
import DataState from '../types/DataState';
import { initialState } from './Reducer';

export const DataContext = createContext<DataState>(initialState);
export const DataProvider = DataContext.Provider;

export function useData() {
  return useContext(DataContext);
}
