import {
  createContext,
  useReducer,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import Highlight from '../../types/Highlight';

type HighlightActions = 'HIDE' | 'SHOW';

interface HighlightState {
  highlights: Set<string>;
  highlighted: Set<string>;
  sourceData?: string;
}

interface HighlightContextProps {
  highlight: HighlightState;
  dispatch: (props: { type: HighlightActions; payload?: any }) => void;
  remove: () => void;
}

const emptyState: HighlightContextProps = {
  highlight: {
    highlights: new Set<string>(),
    highlighted: new Set<string>(),
    sourceData: undefined,
  },
  dispatch: () => null,
  remove: () => null,
};

const highlightContext = createContext<HighlightContextProps>(emptyState);

function highlightReducer(state: HighlightState, action) {
  switch (action.type) {
    case 'SHOW': {
      const { convertedHighlights } = action.payload;

      const newState: HighlightState = {
        ...state,
      };
      for (const value of convertedHighlights) {
        if (value !== undefined) {
          newState.highlights.add(value);
        }
      }
      newState.highlighted = new Set(newState.highlights);

      return newState;
    }
    case 'HIDE': {
      const { convertedHighlights } = action.payload;

      const newState: HighlightState = {
        ...state,
        sourceData: undefined,
      };
      for (const value of convertedHighlights) {
        if (value !== undefined) {
          newState.highlights.delete(value);
        }
      }
      newState.highlighted = new Set(newState.highlights);

      return newState;
    }
    default: {
      throw new Error(`unknown action type: ${action.type}`);
    }
  }
}

export function HighlightProvider(props) {
  const [highlight, dispatch] = useReducer(
    highlightReducer,
    emptyState.highlight,
  );

  const contextValue = useMemo(() => {
    function remove() {
      dispatch({
        type: 'HIDE',
        payload: { convertedHighlights: highlight.highlighted },
      });
    }
    return { highlight, dispatch, remove };
  }, [highlight]);

  return (
    <highlightContext.Provider value={contextValue}>
      {props.children}
    </highlightContext.Provider>
  );
}

export function useHighlightData() {
  return useContext(highlightContext);
}

/**
 * @param {Array<string | number>}  highlights
 * @param {SourceData = null} sourceData
 */
export function useHighlight(highlights: (string | number)[]): Highlight {
  if (!Array.isArray(highlights)) {
    throw new Error('highlights must be an array');
  }
  const { dispatch, highlight } = useHighlightData();

  const convertedHighlights = useMemo(() => {
    const newHighlights = new Set<string>();
    for (const highlight of highlights) {
      if (typeof highlight !== 'string' && typeof highlight !== 'number') {
        throw new Error(`highlight key must be a string or number`);
      }
      if (highlight !== '') {
        newHighlights.add(String(highlight));
      }
    }
    return newHighlights;
  }, [highlights]);

  useEffect(() => {
    // if deletion of component then also delete its highlight information -> componentWillUnmount
    return () => {
      dispatch({
        type: 'HIDE',
        payload: { convertedHighlights: [] },
      });
    };
  }, [dispatch]);

  const isActive = useMemo(() => {
    for (const value of convertedHighlights) {
      if (highlight.highlighted.has(value)) {
        return true;
      }
    }
    return false;
  }, [convertedHighlights, highlight.highlighted]);

  const show = useCallback(() => {
    dispatch({
      type: 'SHOW',
      payload: {
        convertedHighlights,
      },
    });
  }, [dispatch, convertedHighlights]);

  const hide = useCallback(() => {
    dispatch({
      type: 'HIDE',
      payload: {
        convertedHighlights,
      },
    });
  }, [convertedHighlights, dispatch]);

  const add = useCallback(
    (id) => {
      dispatch({
        type: 'SHOW',
        payload: { convertedHighlights: [], id },
      });
    },
    [dispatch],
  );

  const remove = useCallback(
    (id) => {
      dispatch({
        type: 'HIDE',
        payload: { convertedHighlights: [], id },
      });
    },
    [dispatch],
  );

  return useMemo(() => {
    return {
      isActive,
      onHover: {
        onMouseEnter: show,
        onMouseLeave: hide,
      },
      show,
      hide,
      add,
      remove,
    };
  }, [add, hide, isActive, remove, show]);
}
