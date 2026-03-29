import { createContext, useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dispatchContext = createContext<any>({});

export const DispatchProvider = dispatchContext.Provider;

export function useDispatch() {
  const context = useContext(dispatchContext);
  if (context === undefined) {
    throw new Error('useDispatch must be used within a DispatchProvider');
  }
  return context;
}
