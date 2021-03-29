import './QueryPanel.css';

/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { DefaultTolerance, QueryTypes } from './constants';
import QueryOptionsTabs from './tabs/QueryOptionsTabs';

function QueryPanel({ onSubmit, isRequesting }) {
  const [queryType, setQueryType] = useState(QueryTypes.dereplication);
  const [dereplicationOptions, setDereplicationOptions] = useState({
    shiftTolerances: DefaultTolerance,
  });
  const [elucidationOptions, setElucidationOptions] = useState({
    allowHeteroHeteroBonds: false,
  });
  const [resultID, setResultID] = useState('');

  const handleOnSubmit = useCallback(
    async (e) => {
      e.stopPropagation();
      onSubmit(queryType, dereplicationOptions, elucidationOptions, resultID);
    },
    [onSubmit, queryType, dereplicationOptions, elucidationOptions, resultID],
  );

  const handleOnSelectTab = useCallback((_queryType) => {
    setQueryType(_queryType);
  }, []);

  return (
    <div className="query-panel">
      <div className="submit-button-container">
        <QueryOptionsTabs onSelectTab={handleOnSelectTab} />
        <button
          className="submit-button"
          type="button"
          onClick={handleOnSubmit}
          disabled={isRequesting}
        >
          {queryType}
        </button>
      </div>
    </div>
  );
}

export default QueryPanel;
