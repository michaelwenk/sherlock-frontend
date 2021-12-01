import './QueryTabRetrieval.scss';

import { useFormikContext } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { FaEye, FaSyncAlt, FaTrashAlt } from 'react-icons/fa';
import queryTypes from '../../../../constants/queryTypes';
import retrievalActions from '../../../../constants/retrievalAction';
import { useData } from '../../../../context/DataContext';
import { QueryOptions } from '../../../../types/QueryOptions';
import Button from '../../../elements/Button';
import OCLnmr from 'react-ocl-nmr';
import OCL from 'openchemlib/full';
import { Molecule } from 'openchemlib';
import Input from '../../../elements/Input';
import ResultRecord from '../../../../types/sherlock/ResultRecord';
import ConfirmModal from '../../../elements/modal/ConfirmModal';

function QueryTabRetrieval() {
  const { resultDataDB } = useData();
  const { setFieldValue, submitForm } = useFormikContext<QueryOptions>();
  const [searchPattern, setSearchPattern] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [resultRecordToDelete, setResultRecordToDelete] =
    useState<ResultRecord>();

  const filteredResultDataDB = useMemo(
    () =>
      resultDataDB
        ? searchPattern.length > 0
          ? resultDataDB.filter(
              (resultRecord) =>
                resultRecord.name?.toLowerCase().includes(searchPattern) ||
                resultRecord.id?.toLowerCase().includes(searchPattern),
            )
          : resultDataDB
        : [],
    [resultDataDB, searchPattern],
  );

  const filteredRows = useMemo(
    () =>
      filteredResultDataDB.map((resultRecord) => {
        const date = new Date(resultRecord.date);
        const molecule = Molecule.fromSmiles(
          resultRecord.previewDataSet.meta.smiles,
        );

        return (
          <tr key={`resultDataDB_${resultRecord.id}`}>
            <td>{resultRecord.name || resultRecord.id}</td>
            <td>
              {`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`}
              <br />
              {`${date.getHours()}:${date.getMinutes()}`}
            </td>
            <td>{resultRecord.dataSetListSize}</td>
            <td>
              <OCLnmr
                OCL={OCL}
                id={`molSVG${resultRecord.id}`}
                width={100}
                height={100}
                molfile={molecule.toMolfileV3()}
                setSelectedAtom={() => {}}
                atomHighlightColor={'red'}
                atomHighlightOpacity={0.35}
                highlights={[]}
                setHoverAtom={() => {}}
                setMolfile={() => {}}
              />
            </td>
            <td style={{ borderRight: 'none' }}>
              <Button
                child={<FaEye title="Load from Database" />}
                onClick={() => {
                  setFieldValue('queryType', queryTypes.retrieval);
                  setFieldValue(
                    'retrievalOptions.action',
                    retrievalActions.retrieve,
                  );
                  setFieldValue('retrievalOptions.resultID', resultRecord.id);
                  submitForm();
                }}
              />
            </td>
            <td>
              <Button
                child={<FaTrashAlt title="Delete in Database" />}
                onClick={() => {
                  setResultRecordToDelete(resultRecord);
                  setShowDeleteModal(true);
                }}
              />
            </td>
          </tr>
        );
      }),
    [filteredResultDataDB, setFieldValue, submitForm],
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

  return (
    <div className="query-tab-retrieval-container">
      <div className="search-and-button-container">
        <Input
          type="string"
          defaultValue=""
          onChange={(value: string) => setSearchPattern(value.trim())}
          placeholder="Search..."
        />
        <div className="button-container">
          <Button
            child={<FaSyncAlt title="Fetch database entries" />}
            onClick={() => {
              setFieldValue('queryType', queryTypes.retrieval);
              setFieldValue('retrievalOptions.action', retrievalActions.fetch);
              submitForm();
            }}
          />
          <Button
            child={<FaTrashAlt title="Delete all database entries" />}
            onClick={() => {
              setShowDeleteModal(true);
            }}
          />
        </div>
      </div>
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
      {filteredRows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name/ID</th>
              <th>Date</th>
              <th>Count</th>
              <th>Preview</th>
              <th style={{ borderRight: 'none' }}></th>
              <th></th>
            </tr>
          </thead>
          <tbody>{filteredRows}</tbody>
        </table>
      )}
    </div>
  );
}

export default QueryTabRetrieval;
