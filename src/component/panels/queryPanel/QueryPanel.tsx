import './QueryPanel.scss';

import React, { useCallback, useState } from 'react';
import QueryTabs from './tabs/QueryTabs';
import { Formik, Form } from 'formik';
import validateQueryOptions from '../../../utils/queryOptionsValidation';
import defaultQueryOptions from '../../../constants/defaultQueryOptions';
import Button from '../../elements/Button';
import queryTypes from '../../../constants/queryTypes';

type InputProps = {
  onSubmit: Function;
  isRequesting: boolean;
  show: boolean;
};

function QueryPanel({ onSubmit, isRequesting, show }: InputProps) {
  const [queryType, setQueryType] = useState<string>(queryTypes.dereplication);

  const handleOnSelectTab = useCallback((type) => {
    setQueryType(type);
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
            values.queryType,
            values.dereplicationOptions,
            values.elucidationOptions,
            values.detectionOptions,
            values.retrievalOptions,
          );
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, submitForm }) => (
          <Form>
            <div className="form-tabs-container">
              <QueryTabs onSelectTab={handleOnSelectTab} />
              <Button
                onClick={() => {
                  setFieldValue('queryType', queryType);
                  submitForm();
                }}
                child={queryType}
                disabled={isRequesting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default QueryPanel;
