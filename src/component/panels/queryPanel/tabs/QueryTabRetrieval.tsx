import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import { FaEye, FaSyncAlt, FaTrashAlt } from 'react-icons/fa';
import queryTypes from '../../../../constants/queryTypes';
import retrievalActions from '../../../../constants/retrievalAction';
import { useData } from '../../../../context/DataContext';
import { QueryOptions } from '../../../../types/QueryOptions';
import Button from '../../../elements/Button';

function QueryTabRetrieval() {
  const { resultDataDB } = useData();
  const { setFieldValue, submitForm } = useFormikContext<QueryOptions>();

  const rows = useMemo(() => {
    return resultDataDB
      ? resultDataDB.map((resultRecord) => {
          const date = new Date(resultRecord.date);
          return (
            <tr key={`resultDataDB_${resultRecord.id}`}>
              <td>{resultRecord.name}</td>
              <td>{`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`}</td>
              {/* <td>{resultRecord.id}</td> */}
              <td>
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
      {/* <Input
        type="text"
        onChange={(value: string) => {
          setFieldValue('queryType', queryTypes.retrieval);
          setFieldValue('retrievalOptions.action', retrievalActions.retrieve);
          setFieldValue('retrievalOptions.resultID', value);
          setFieldValue('retrievalOptions.resultName', 'TEST_NAME');
        }}
        defaultValue=""
        label="Result ID"
        className="retrieval-input"
      /> */}
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
          setFieldValue('queryType', queryTypes.retrieval);
          setFieldValue('retrievalOptions.action', retrievalActions.deleteAll);
          submitForm();
        }}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            {/* <th>ID</th> */}
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default QueryTabRetrieval;
