import './QueryPanel.css';

/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import QueryOptionsTabs from './tabs/QueryOptionsTabs';
import { Formik, Form } from 'formik';
import validateQueryOptions from '../../../utils/queryOptionsValidation';
import defaultQueryOptions from '../../../constants/defaultQueryOptions';
import queryTypes from '../../../constants/queryTypes';

function QueryPanel({ onSubmit, isRequesting }) {
  const [queryType, setQueryType] = useState(queryTypes.dereplication);

  const handleOnSelectTab = useCallback((_queryType) => {
    setQueryType(_queryType);
  }, []);

  return (
    <Formik
      initialValues={defaultQueryOptions}
      validate={validateQueryOptions}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(
          queryType,
          values.dereplicationOptions,
          values.elucidationOptions,
          values.retrievalOptions,
        );
        setSubmitting(false);
      }}
    >
      {() => (
        <Form>
          <div className="query-panel">
            <div className="tabs-container">
              <QueryOptionsTabs onSelectTab={handleOnSelectTab} />
            </div>
            <div className="submit-button-container">
              <button
                className="submit-button"
                type="submit"
                disabled={isRequesting}
              >
                {queryType}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default QueryPanel;
