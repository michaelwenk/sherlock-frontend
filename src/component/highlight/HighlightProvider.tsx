import { useMemo, useReducer } from 'react';
import emptyState from './emptyState';
import highlightReducer from './highlightReducer';
import highlightContext from './highlightContext';

function HighlightProvider(props) {
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

export default HighlightProvider;
