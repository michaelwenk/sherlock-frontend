import './QueryTabRetrieval.scss';

import { useFormikContext } from 'formik';
import { useMemo, useState } from 'react';
import { FaEye, FaSyncAlt, FaTrashAlt } from 'react-icons/fa';
import queryTypes from '../../../../constants/queryTypes';
import retrievalActions from '../../../../constants/retrievalAction';
import { useData } from '../../../../context/DataContext';
import { QueryOptions } from '../../../../types/QueryOptions';
import Button from '../../../elements/Button';
import OCLnmr from 'react-ocl-nmr';
import OCL from 'openchemlib/full';
import { Molecule } from 'openchemlib';
import CustomModal from '../../../elements/Modal';

function QueryTabRetrieval() {
  const { resultDataDB } = useData();
  const { setFieldValue, submitForm } = useFormikContext<QueryOptions>();
  const [showDeleteAllModal, setShowDeleteAllModal] = useState<boolean>(false);

  const rows = useMemo(() => {
    return resultDataDB
      ? resultDataDB.map((resultRecord) => {
          const date = new Date(resultRecord.date);
          const molecule = Molecule.fromSmiles(
            resultRecord.previewDataSet.meta.smiles,
          );

          return (
            <tr key={`resultDataDB_${resultRecord.id}`}>
              <td>{resultRecord.name}</td>
              <td>{`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}, ${date.getHours()}:${date.getMinutes()}`}</td>
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
                    setFieldValue('queryType', queryTypes.retrieval);
                    setFieldValue(
                      'retrievalOptions.action',
                      retrievalActions.deletion,
                    );
                    setFieldValue('retrievalOptions.resultID', resultRecord.id);
                    submitForm();
                  }}
                />
              </td>
            </tr>
          );
        })
      : [];
  }, [resultDataDB, setFieldValue, submitForm]);

  return (
    <div className="query-tab-retrieval-container">
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
            setShowDeleteAllModal(true);
          }}
        />
      </div>
      {showDeleteAllModal && (
        <CustomModal
          show={showDeleteAllModal}
          title="Delete all result database entries?"
          onClose={() => {
            setShowDeleteAllModal(false);
          }}
          footer={
            <Button
              child="Confirm"
              onClick={() => {
                setFieldValue('queryType', queryTypes.retrieval);
                setFieldValue(
                  'retrievalOptions.action',
                  retrievalActions.deleteAll,
                );
                submitForm();
                setShowDeleteAllModal(false);
              }}
              className="footer-button"
            />
          }
        />
      )}
      {rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Count</th>
              <th>Preview</th>
              <th style={{ borderRight: 'none' }}></th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      )}
    </div>
  );
}

export default QueryTabRetrieval;
