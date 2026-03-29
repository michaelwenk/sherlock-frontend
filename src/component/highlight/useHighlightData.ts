import { useContext } from 'react';
import HighlightContextProps from '../../types/highlight/HighlightContextProps';
import highlightContext from './highlightContext';

function useHighlightData() {
  return useContext<HighlightContextProps>(highlightContext);
}

export default useHighlightData;
