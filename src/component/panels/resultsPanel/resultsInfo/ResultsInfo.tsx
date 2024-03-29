import './ResultsInfo.scss';

import { memo, useCallback, useMemo } from 'react';
import { useData } from '../../../../context/DataContext';
import Button from '../../../elements/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import queryTypes from '../../../../constants/queryTypes';

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

  return useMemo(
    () =>
      resultData ? (
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
                    child={
                      <FontAwesomeIcon icon={faFileDownload} title="Download" />
                    }
                    onClick={handleOnClickDownload}
                    disabled={
                      resultData.resultRecord?.dataSetList &&
                      resultData.resultRecord.dataSetList.length > 0
                        ? false
                        : true
                    }
                  />
                  <Button
                    child={
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        title="Delete result entry in database"
                      />
                    }
                    onClick={handleOnClickDelete}
                    disabled={
                      resultData.resultRecord?.dataSetList &&
                      resultData.resultRecord.dataSetList.length > 0
                        ? false
                        : true
                    }
                    style={{
                      display:
                        resultData.queryType !== queryTypes.elucidation &&
                        resultData.queryType !== queryTypes.retrieval
                          ? 'none'
                          : undefined,
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null,
    [handleOnClickDelete, handleOnClickDownload, resultData],
  );
}

export default memo(ResultsInfo);
