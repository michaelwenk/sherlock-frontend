import './QueryPanel.scss';

import React, { useCallback, useState } from 'react';
import QueryOptionsTabs from './tabs/QueryOptionsTabs';
import { Formik, Form } from 'formik';
import validateQueryOptions from '../../../utils/queryOptionsValidation';
import defaultQueryOptions from '../../../constants/defaultQueryOptions';
import queryTypes from '../../../constants/queryTypes';

type InputProps = {
  onSubmit: Function;
  isRequesting: boolean;
  show: boolean;
};

function QueryPanel({ onSubmit, isRequesting, show }: InputProps) {
  const [queryType, setQueryType] = useState<string>(queryTypes.dereplication);

  const handleOnSelectTab = useCallback((_queryType) => {
    setQueryType(_queryType);
  }, []);

  return (
    <div
      className="query-panel"
      style={
        {
          '--show': show ? 'flex' : 'none',
        } as React.CSSProperties
      }
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
