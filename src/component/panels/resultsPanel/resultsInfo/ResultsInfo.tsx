import './ResultsInfo.scss';

import { useCallback } from 'react';
import { Result } from '../../../../App';

type InputProps = {
  result: Result,
  onClickDownload: Function,
  onClickClear: Function,
  onChangeSortByValue: Function,
}

function ResultsInfo({
  result,
  onClickDownload,
  onChangeSortByValue,
  onClickClear,
} : InputProps) {
  const handleOnClickDownload = useCallback(
    (e) => {
      e.stopPropagation();
      onClickDownload();
    },
    [onClickDownload],
  );

  // const handleOnChangeSortByValue = useCallback(
  //   (value) => {
  //     onChangeSortByValue(value);
  //   },
  //   [onChangeSortByValue],
  // );

  const handleOnClickClear = useCallback(
    (e) => {
      e.stopPropagation();
      onClickClear();
    },
    [onClickClear],
  );

  return result ? (
    <div className="info-container">
      <p>Result ID: {result.resultID}</p>
      <button
        type="button"
        onClick={handleOnClickDownload}
        disabled={
          result.molecules && result.molecules.length > 0 ? false : true
        }
      >
        Download
      </button>
      <button
        type="button"
        onClick={handleOnClickClear}
        disabled={
          result.molecules && result.molecules.length > 0 ? false : true
        }
      >
        Clear
      </button>
      {/* <SelectBox
        selectionOptions={Object.keys(sortOptions).map(
          (sortOptionKey) => sortOptions[sortOptionKey],
        )}
        defaultValue={sortOptions.rmsd}
        onChange={handleOnChangeSortByValue}
      /> */}
    </div>
  ) : null;
}

export default ResultsInfo;
