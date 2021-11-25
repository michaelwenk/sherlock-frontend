import './ResultsPanel.scss';

import { useCallback, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import ResultsInfo from './resultsInfo/ResultsInfo';
import ResultsView from './resultsContainer/resultsView/ResultsView';
import buildSDFileContent from '../../../utils/buildSDFileContent';
import { Result } from '../../../types/Result';
import { useData } from '../../../context/DataContext';
import buildMolecules from '../../../utils/buildMolecules';
import { useDispatch } from '../../../context/DispatchContext';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  CLEAR_RESULT_DATA,
  SET_RESULT_DB_ENTRIES,
} from '../../../context/ActionTypes';
import ConfirmModal from '../../elements/modal/ConfirmModal';

type InputProps = {
  result?: Result;
  show: boolean;
};

function ResultsPanel({ show }: InputProps) {
  const { resultData } = useData();
  const dispatch = useDispatch();

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const molecules = useMemo(() => {
    return resultData && resultData.resultRecord
      ? buildMolecules(resultData.resultRecord)
      : [];
  }, [resultData]);

  const handleOnClickDownload = useCallback(() => {
    if (molecules) {
      const fileData = buildSDFileContent({ resultMolecules: molecules });
      const blob = new Blob([fileData], { type: 'text/plain' });
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
    }
  }, [molecules, resultData]);

  const handleOnClickDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleOnConfirmDelete = useCallback(async () => {
    await axios({
      method: 'DELETE',
      url: 'http://localhost:8081/webcase-db-service-result/deleteById',
      params: { id: resultData?.resultRecord.id },
    }).catch(async (err: AxiosError) => {
      if (axios.isCancel(err)) {
        console.log(err);
      }
    });
    dispatch({ type: CLEAR_RESULT_DATA });
    await axios({
      method: 'GET',
      url: 'http://localhost:8081/webcase-db-service-result/getAllMeta',
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
  }, [dispatch, resultData?.resultRecord]);

  return resultData ? (
    <div
      className="results-panel"
      style={
        {
          '--show': show ? 'flex' : 'none',
        } as React.CSSProperties
      }
    >
      <ResultsInfo
        onClickDownload={handleOnClickDownload}
        onClickDelete={handleOnClickDelete}
      />
      <ResultsView
        molecules={molecules}
        maxPages={5}
        pageLimits={[10, 25, 50]}
      />
      {showDeleteModal && (
        <ConfirmModal
          show={showDeleteModal}
          title={`Delete ${
            resultData?.resultRecord.name || resultData?.resultRecord.id
          }?`}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleOnConfirmDelete}
        />
      )}
    </div>
  ) : null;
}

export default ResultsPanel;
