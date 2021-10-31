import './ResultsInfo.scss';

import { useCallback } from 'react';
import { useData } from '../../../../context/DataContext';

type InputProps = {
  onClickDownload: Function;
  onClickClear: Function;
  onChangeSortByValue: Function;
};

function ResultsInfo({
  onClickDownload,
  onChangeSortByValue,
  onClickClear,
}: InputProps) {
  const { resultData } = useData();

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

  return resultData ? (
    <div className="info-container">
      <p>Result ID: {resultData.resultID}</p>
      <button
        type="button"
        onClick={handleOnClickDownload}
        disabled={
          resultData.molecules && resultData.molecules.length > 0 ? false : true
        }
      >
        Download
      </button>
      <button
        type="button"
        onClick={handleOnClickClear}
        disabled={
          resultData.molecules && resultData.molecules.length > 0 ? false : true
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
