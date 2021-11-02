import './ResultsInfo.scss';

import { useCallback } from 'react';
import { useData } from '../../../../context/DataContext';
import Button from '../../../elements/Button';
import { FaFileDownload, FaTrashAlt } from 'react-icons/fa';

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

  const handleOnClickDownload = useCallback(() => {
    onClickDownload();
  }, [onClickDownload]);

  // const handleOnChangeSortByValue = useCallback(
  //   (value) => {
  //     onChangeSortByValue(value);
  //   },
  //   [onChangeSortByValue],
  // );

  const handleOnClickClear = useCallback(() => {
    onClickClear();
  }, [onClickClear]);

  return resultData ? (
    <div className="info-container">
      <Button
        child={<FaFileDownload title="Download" />}
        onClick={handleOnClickDownload}
        disabled={
          resultData.resultRecord?.dataSetList &&
          resultData.resultRecord.dataSetList.length > 0
            ? false
            : true
        }
      />
      <Button
        child={<FaTrashAlt title="Clear" />}
        onClick={handleOnClickClear}
        disabled={
          resultData.resultRecord?.dataSetList &&
          resultData.resultRecord.dataSetList.length > 0
            ? false
            : true
        }
      />
      <p>Task name: {resultData.resultRecord?.name}</p>
      <p>Result count: {resultData.resultRecord?.dataSetListSize}</p>
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
