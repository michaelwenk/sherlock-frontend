/** @jsxImportSource @emotion/react */
import { useCallback } from 'react';

function ResultsInfo({ results, onClickDownload }) {
  const handleOnClickDownload = useCallback(
    (e) => {
      e.stopPropagation();
      onClickDownload();
    },
    [onClickDownload],
  );

  return results ? (
    <div className="info-container">
      <p>
        {results.data.dataSetList.length > 0
          ? results.data.dataSetList.length +
            ' result(s) in ' +
            results.time.toFixed(2) +
            's'
          : 'No results'}
      </p>
      <p>{results.data.requestID}</p>
      <button
        type="button"
        onClick={handleOnClickDownload}
        disabled={results.data.dataSetList.length > 0 ? false : true}
      >
        Download Results
      </button>
    </div>
  ) : null;
}

export default ResultsInfo;
