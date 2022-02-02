import './QueryTabRetrieval.scss';

import { useFormikContext } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { FaEye, FaSyncAlt, FaTrashAlt } from 'react-icons/fa';
import queryTypes from '../../../../constants/queryTypes';
import retrievalActions from '../../../../constants/retrievalAction';
import { useData } from '../../../../context/DataContext';
import QueryOptions from '../../../../types/QueryOptions';
import Button from '../../../elements/Button';
import OCL from 'openchemlib/full';
import Input from '../../../elements/Input';
import ResultRecord from '../../../../types/sherlock/ResultRecord';
import ConfirmModal from '../../../elements/modal/ConfirmModal';
import { SmilesSvgRenderer } from 'react-ocl/base';
import CustomPagination from '../../../elements/CustomPagination';

interface Row {
  id: string;
  name: string;
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
            const date = new Date(resultRecord.date || '');

            return {
              id: resultRecord.id || '',
              name: resultRecord.name || '',
              rendered: (
                <tr key={`resultDataDB_${resultRecord.id}`}>
                  <td>{resultRecord.name || resultRecord.id}</td>
                  <td>
                    {`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`}
                    <br />
                    {`${date.getHours()}:${date.getMinutes()}`}
                  </td>
                  <td>{resultRecord.dataSetListSize}</td>
                  <td>
                    {resultRecord.previewDataSet?.meta.smiles && (
                      <div className="rendered-preview">
                        <SmilesSvgRenderer
                          OCL={OCL}
                          id={`molSVG${resultRecord.id}_preview`}
                          smiles={resultRecord.previewDataSet.meta.smiles}
                          width={120}
                        />
                      </div>
                    )}
                  </td>
                  <td>
                    <Button
                      child={<FaEye title="Load from Database" />}
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
                      child={<FaTrashAlt title="Delete in Database" />}
                      onClick={() => {
                        setResultRecordToDelete(resultRecord);
                        setShowDeleteModal(true);
                      }}
                      style={{
                        marginLeft: '10px',
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

  const filteredRows = useMemo(
    () =>
      searchPattern.length > 0
        ? rows.reduce((_filteredRows, row) => {
            if (
              row.name?.toLowerCase().includes(searchPattern) ||
              row.id?.toLowerCase().includes(searchPattern)
            ) {
              _filteredRows.push(row.rendered);
            }
            return _filteredRows;
          }, [] as JSX.Element[])
        : rows.map((row) => row.rendered),
    [rows, searchPattern],
  );

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

  return (
    <div className="query-tab-retrieval-container">
      <div className="search-and-button-container">
        <div className="search-container">
          <Input
            type="text"
            defaultValue=""
            onChange={(value: string) => setSearchPattern(value.trim())}
            placeholder="Search..."
            inputWidth="100%"
          />
        </div>
        <div className="button-and-pagination-container">
          <div className="pagination-container">
            {filteredRows.length > 0 && (
              <CustomPagination
                data={retrievalData}
                selected={selectedIndex}
                onSelect={handleOnSelectIndex}
                maxPages={3}
              />
            )}
          </div>
          <div className="button-container">
            <Button
              child={<FaSyncAlt title="Fetch database entries" />}
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
              child={<FaTrashAlt title="Delete all database entries" />}
              onClick={() => {
                setShowDeleteModal(true);
              }}
              disabled={isRequesting}
              style={{ color: isRequesting ? 'grey' : 'inherit' }}
            />
          </div>
        </div>
      </div>
      {filteredRows.length > 0 && (
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
      )}
      {showDeleteModal && (
        <ConfirmModal
          show={showDeleteModal}
          title={
            resultRecordToDelete
              ? `Delete ${
                  resultRecordToDelete.name || resultRecordToDelete.id
                }?`
              : 'Delete all result database entries?'
          }
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleOnConfirmDelete}
        />
      )}
    </div>
  );
}

export default QueryTabRetrieval;
