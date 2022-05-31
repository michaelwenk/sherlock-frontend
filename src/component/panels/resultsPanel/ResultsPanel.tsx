import './ResultsPanel.scss';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import ResultsView from './resultsContainer/resultsView/ResultsView';
import buildSDFileContent from '../../../utils/buildSDFileContent';
import Result from '../../../types/Result';
import { useData } from '../../../context/DataContext';
import { useDispatch } from '../../../context/DispatchContext';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  CLEAR_RESULT_DATA,
  SET_RESULT_DB_ENTRIES,
} from '../../../context/ActionTypes';
import ConfirmModal from '../../elements/modal/ConfirmModal';
import CustomModal from '../../elements/modal/CustomModal';
import DataSet from '../../../types/sherlock/dataSet/DataSet';

type InputProps = {
  result?: Result;
  show: boolean;
};

function ResultsPanel({ show }: InputProps) {
  const { resultData } = useData();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isPreparingDownload, setIsPreparingDownload] =
    useState<boolean>(false);

  const dataSets = useMemo((): DataSet[] => {
    return resultData &&
      resultData.resultRecord &&
      resultData.resultRecord.dataSetList
      ? resultData.resultRecord.dataSetList
      : [];
  }, [resultData]);

  const onDownload = useCallback(async () => {
    new Promise<string>((resolve) => resolve(buildSDFileContent({ dataSets })))
      .then((fileContent) => {
        const blob = new Blob([fileContent], { type: 'text/plain' });
        saveAs(
          blob,
          `${
            resultData
              ? resultData.resultRecord?.name
                ? resultData.resultRecord.name
                : 'results'
              : 'results'
          }.sdf`,
        );
      })
      .finally(() => setIsPreparingDownload(false));
  }, [dataSets, resultData]);

  const handleOnClickDownload = useCallback(async () => {
    setIsPreparingDownload(true);
  }, []);

  useEffect(() => {
    if (isPreparingDownload) {
      onDownload();
    }
  }, [isPreparingDownload, onDownload]);

  const handleOnClickDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleOnConfirmDelete = useCallback(async () => {
    await axios({
      method: 'DELETE',
      url: 'http://localhost:8081/sherlock-db-service-result/deleteById',
      params: { id: resultData?.resultRecord.id },
    })
      .then()
      .catch(async (err: AxiosError) => {
        if (axios.isCancel(err)) {
          console.log(err);
        }
      })
      .finally(async () => {
        dispatch({ type: CLEAR_RESULT_DATA });
        await axios({
          method: 'GET',
          url: 'http://localhost:8081/sherlock-db-service-result/getAllMeta',
        })
          .then((res: AxiosResponse) => {
            if (res && res.data) {
              dispatch({
                type: SET_RESULT_DB_ENTRIES,
                payload: { resultRecordList: res.data },
              });
            }
          })
          .catch(async (err: AxiosError) => {
            if (axios.isCancel(err)) {
              console.log(err);
            }
          });

        setShowDeleteModal(false);
      });
  }, [dispatch, resultData?.resultRecord]);

  const resultsView = useMemo(
    () => (
      <ResultsView
        dataSets={dataSets}
        maxPages={5}
        pageLimits={[10, 25, 50]}
        onClickDownload={handleOnClickDownload}
        onClickDelete={handleOnClickDelete}
      />
    ),
    [dataSets, handleOnClickDownload, handleOnClickDelete],
  );

  return useMemo(
    () =>
      resultData ? (
        <div
          className="results-panel"
          style={
            {
              '--show': show ? 'flex' : 'none',
            } as React.CSSProperties
          }
        >
          {resultsView}
          <CustomModal
            title="Preparing Download..."
            show={isPreparingDownload}
            showCloseButton={false}
          />
          <ConfirmModal
            show={showDeleteModal}
            title={`Delete ${
              resultData?.resultRecord.name || resultData?.resultRecord.id
            }?`}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleOnConfirmDelete}
            body={
              <p
                style={{
                  fontSize: '15px',
                  color: 'blue',
                }}
              >
                This can not be undone!
              </p>
            }
          />
        </div>
      ) : null,
    [
      handleOnConfirmDelete,
      isPreparingDownload,
      resultData,
      resultsView,
      show,
      showDeleteModal,
    ],
  );
}

export default memo(ResultsPanel);
