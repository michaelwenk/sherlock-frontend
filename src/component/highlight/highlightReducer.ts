import HighlightAction from '../../types/highlight/HighlightAction';
import HighlightState from '../../types/highlight/HighlightState';

function highlightReducer(state: HighlightState, action: HighlightAction) {
  switch (action.type) {
    case 'SHOW': {
      const { convertedHighlights, source } = action.payload;

      const newState: HighlightState = {
        ...state,
      };
      for (const value of convertedHighlights) {
        if (value !== undefined) {
          newState.highlights.add(value);
        }
      }
      newState.highlighted = new Set(newState.highlights);
      newState.source = source;

      return newState;
    }
    case 'HIDE': {
      const { convertedHighlights } = action.payload;

      const newState: HighlightState = {
        ...state,
      };
      for (const value of convertedHighlights) {
        if (value !== undefined) {
          newState.highlights.delete(value);
        }
      }
      newState.highlighted = new Set(newState.highlights);
      newState.source = undefined;

      return newState;
    }
    default: {
      throw new Error(`unknown action type: ${action.type}`);
    }
  }
}

export default highlightReducer;
