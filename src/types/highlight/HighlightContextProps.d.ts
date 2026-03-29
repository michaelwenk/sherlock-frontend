import { Dispatch } from 'react';
import HighlightState from './HighlightState';
import HighlightAction from './HighlightAction';

interface HighlightContextProps {
  highlight: HighlightState;
  dispatch: Dispatch<HighlightAction>;
  remove: () => void;
}

export default HighlightContextProps;
