import './ResultsInfo.scss';

import { useCallback } from 'react';
import { useData } from '../../../../context/DataContext';
import Button from '../../../elements/Button';
import { FaFileDownload, FaTrashAlt } from 'react-icons/fa';

type InputProps = {
  onClickDownload: Function;
  onClickDelete: Function;
};

function ResultsInfo({ onClickDownload, onClickDelete }: InputProps) {
  const { resultData } = useData();

  const handleOnClickDownload = useCallback(() => {
    onClickDownload();
  }, [onClickDownload]);

  const handleOnClickDelete = useCallback(() => {
    onClickDelete(resultData?.resultRecord);
  }, [onClickDelete, resultData?.resultRecord]);

  return resultData ? (
    <div className="info-container">
      <table className="info-table">
        <thead>
          <tr>
            <td>Name</td>
            <td>Results</td>
            {resultData.time && <td>Time</td>}
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="value">
              {resultData.resultRecord?.name || resultData.resultRecord?.id}
            </td>
            <td className="value">
              {resultData.resultRecord?.dataSetListSize}
            </td>
            {resultData.time && (
              <td className="value">
                {`${Math.floor(resultData.time / 60).toFixed(0)}min, ${(
                  resultData.time % 60
                ).toFixed(0)}s`}
              </td>
            )}
            <td>
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
                child={<FaTrashAlt title="Delete result entry in database" />}
                onClick={handleOnClickDelete}
                disabled={
                  resultData.resultRecord?.dataSetList &&
                  resultData.resultRecord.dataSetList.length > 0
                    ? false
                    : true
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : null;
}

export default ResultsInfo;
