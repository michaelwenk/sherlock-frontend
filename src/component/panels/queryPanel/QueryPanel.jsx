import './QueryPanel.scss';

import { useCallback, useState } from 'react';
import QueryOptionsTabs from './tabs/QueryOptionsTabs';
import { Formik, Form } from 'formik';
import validateQueryOptions from '../../../utils/queryOptionsValidation';
import defaultQueryOptions from '../../../constants/defaultQueryOptions';
import queryTypes from '../../../constants/queryTypes';

function QueryPanel({ onSubmit, isRequesting, show }) {
  const [queryType, setQueryType] = useState(queryTypes.dereplication);

  const handleOnSelectTab = useCallback((_queryType) => {
    setQueryType(_queryType);
  }, []);

  return (
    <div
      className="query-panel"
      style={{
        '--show': show ? 'flex' : 'none',
      }}
    >
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
            <div className="form-tabs-container">
              <QueryOptionsTabs onSelectTab={handleOnSelectTab} />
              <button type="submit" disabled={isRequesting}>
                {queryType}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default QueryPanel;
