import { createContext } from 'react';
import HighlightContextProps from '../../types/highlight/HighlightContextProps';
import emptyState from './emptyState';

const highlightContext = createContext<HighlightContextProps>(emptyState);

export default highlightContext;
