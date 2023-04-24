import './QueryTabRetrieval.scss';

import { useFormikContext } from 'formik';
import { memo, useCallback, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
('@fortawesome/react-fontawesome');
import {
  faEye,
  faSyncAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import queryTypes from '../../../../constants/queryTypes';
import retrievalActions from '../../../../constants/retrievalAction';
import { useData } from '../../../../context/DataContext';
import QueryOptions from '../../../../types/QueryOptions';
import Button from '../../../elements/Button';
import OCL from 'openchemlib/full';
import Input from '../../../elements/Input';
import ResultRecord from '../../../../types/sherlock/ResultRecord';
import ConfirmModal from '../../../elements/modal/ConfirmModal';
import { MolfileSvgRenderer } from 'react-ocl/base';
import CustomPagination from '../../../elements/CustomPagination';
import removeCollectionPartFromMolfile from '../../../../utils/removeCollectionPartFromMolfile';

interface Row {
  id: string;
  name: string;
  date: Date;
  rendered: JSX.Element;
}

function QueryTabRetrieval() {
  const { resultDataDB, isRequesting } = useData();
  const { setFieldValue, submitForm } = useFormikContext<QueryOptions>();
  const [searchPattern, setSearchPattern] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [resultRecordToDelete, setResultRecordToDelete] =
    useState<ResultRecord>();

  const rows = useMemo(
    (): Row[] =>
      resultDataDB
        ? resultDataDB.map((resultRecord) => {
            const offset = new Date().getTimezoneOffset();
            const date = new Date(
              new Date(resultRecord.date as string).getTime() -
                offset * 60 * 1000,
            );

            return {
              id: resultRecord.id || '',
              name: resultRecord.name || '',
              date,
              rendered: (
                <tr key={`resultDataDB_${resultRecord.id}`}>
                  <td>{resultRecord.name || resultRecord.id}</td>
                  <td>
                    {`${date.getFullYear()}-${date.getMonth() + 1}-${
                      date.getDay() + 1
                    }`}
                    <br />
                    {`${date.getHours().toLocaleString(undefined, {
                      minimumIntegerDigits: 2,
                    })}:${date.getMinutes().toLocaleString(undefined, {
                      minimumIntegerDigits: 2,
                    })}`}
                  </td>
                  <td>{resultRecord.dataSetListSize}</td>
                  <td>
                    {resultRecord.previewDataSet?.meta.molfile && (
                      <div className="rendered-preview">
                        <MolfileSvgRenderer
                          OCL={OCL}
                          id={`molSVG${resultRecord.id}_preview`}
                          molfile={removeCollectionPartFromMolfile(
                            resultRecord.previewDataSet.meta.molfile,
                          )}
                          width={120}
                        />
                      </div>
                    )}
                  </td>
                  <td>
                    <Button
                      child={
                        <FontAwesomeIcon
                          icon={faEye}
                          title="Load from Database"
                        />
                      }
                      onClick={() => {
                        setFieldValue('queryType', queryTypes.retrieval);
                        setFieldValue(
                          'retrievalOptions.action',
                          retrievalActions.retrieve,
                        );
                        setFieldValue(
                          'retrievalOptions.resultID',
                          resultRecord.id,
                        );
                        submitForm();
                      }}
                      disabled={isRequesting}
                      style={{ color: isRequesting ? 'grey' : 'inherit' }}
                    />
                    <Button
                      child={
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          title="Delete in Database"
                        />
                      }
                      onClick={() => {
                        setResultRecordToDelete(resultRecord);
                        setShowDeleteModal(true);
                      }}
                      style={{
                        marginLeft: '15px',
                        color: isRequesting ? 'grey' : 'inherit',
                      }}
                      disabled={isRequesting}
                    />
                  </td>
                </tr>
              ),
            };
          })
        : [],
    [isRequesting, resultDataDB, setFieldValue, submitForm],
  );

  const filteredRows = useMemo(() => {
    const _filteredRows =
      searchPattern.length > 0
        ? rows.reduce((_rows, row) => {
            if (
              row.name?.toLowerCase().includes(searchPattern) ||
              row.id?.toLowerCase().includes(searchPattern)
            ) {
              _rows.push(row);
            }
            return _rows;
          }, [] as Row[])
        : rows;
    return _filteredRows
      .sort((a, b) => -1 * (a.date.getTime() - b.date.getTime()))
      .map((row) => row.rendered);
  }, [rows, searchPattern]);

  const handleOnConfirmDelete = useCallback(() => {
    setFieldValue('queryType', queryTypes.retrieval);
    if (resultRecordToDelete) {
      setFieldValue('retrievalOptions.action', retrievalActions.deletion);
      setFieldValue('retrievalOptions.resultID', resultRecordToDelete.id);
    } else {
      setFieldValue('retrievalOptions.action', retrievalActions.deleteAll);
    }
    submitForm().then(() => {
      setShowDeleteModal(false);
      setResultRecordToDelete(undefined);
    });

    setShowDeleteModal(false);
  }, [resultRecordToDelete, setFieldValue, submitForm]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const handleOnSelectIndex = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const retrievalData = useMemo(() => {
    const _retrievalData: JSX.Element[][] = [];
    let counter = 0;
    let rows: JSX.Element[] = [];
    const selectedPageLimit = 20;

    for (let i = 0; i < filteredRows.length; i++) {
      if (counter < selectedPageLimit) {
        counter++;
        rows.push(filteredRows[i]);
      } else {
        _retrievalData.push(rows);
        rows = [filteredRows[i]];
        counter = 1;
      }
    }
    if (rows.length > 0) {
      _retrievalData.push(rows);
    }

    return _retrievalData;
  }, [filteredRows]);

  return useMemo(
    () => (
      <div className="query-tab-retrieval-container">
        <div className="search-and-button-container">
          <div className="search-container">
            {rows.length > 0 && (
              <Input
                type="text"
                defaultValue=""
                onChange={(value: string) => setSearchPattern(value.trim())}
                placeholder="Search by Name/ID ..."
                inputWidth="100%"
              />
            )}
          </div>
          <div className="button-and-pagination-container">
            <div className="pagination-container">
              {filteredRows.length > 0 && (
                <CustomPagination
                  data={retrievalData}
                  selected={selectedIndex}
                  onSelect={handleOnSelectIndex}
                  maxPages={3}
                  showFirst={true}
                  showLast={true}
                />
              )}
            </div>
            <div className="button-container">
              <Button
                child={
                  <FontAwesomeIcon
                    icon={faSyncAlt}
                    title="Fetch database entries"
                  />
                }
                onClick={() => {
                  setFieldValue('queryType', queryTypes.retrieval);
                  setFieldValue(
                    'retrievalOptions.action',
                    retrievalActions.fetch,
                  );
                  submitForm();
                }}
                disabled={isRequesting}
                style={{ color: isRequesting ? 'grey' : 'inherit' }}
              />
              <Button
                child={
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    title="Delete all database entries"
                  />
                }
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                disabled={isRequesting}
                style={{ color: isRequesting ? 'grey' : 'inherit' }}
              />
            </div>
          </div>
        </div>
        {
          <div className="retrieval-table">
            <table>
              <thead>
                <tr>
                  <th>Name/ID</th>
                  <th>Date</th>
                  <th>Count</th>
                  <th>Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{retrievalData[selectedIndex]}</tbody>
            </table>
          </div>
        }
        {showDeleteModal && (
          <ConfirmModal
            show={showDeleteModal}
            header={
              resultRecordToDelete
                ? `Delete ${
                    resultRecordToDelete.name || resultRecordToDelete.id
                  }?`
                : 'Delete all result database entries?'
            }
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
            onCancel={() => {
              setShowDeleteModal(false);
              setResultRecordToDelete(undefined);
            }}
            onConfirm={handleOnConfirmDelete}
          />
        )}
      </div>
    ),
    [
      filteredRows.length,
      handleOnConfirmDelete,
      handleOnSelectIndex,
      isRequesting,
      resultRecordToDelete,
      retrievalData,
      rows.length,
      selectedIndex,
      setFieldValue,
      showDeleteModal,
      submitForm,
    ],
  );
}

export default memo(QueryTabRetrieval);
