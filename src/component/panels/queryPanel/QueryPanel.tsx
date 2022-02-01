import './QueryPanel.scss';

import React, { useMemo } from 'react';
import QueryTabs from './tabs/QueryTabs';
import { Formik, Form } from 'formik';
import validateQueryOptions from '../../../utils/queryOptionsValidation';
import defaultQueryOptions from '../../../constants/defaultQueryOptions';
import QueryOptions from '../../../types/QueryOptions';
import { useData } from '../../../context/DataContext';

type InputProps = {
  onSubmit: Function;
  show: boolean;
};

function QueryPanel({ onSubmit, show }: InputProps) {
  const { resultData } = useData();

  const queryOptions = useMemo((): QueryOptions => {
    const _queryOptions: QueryOptions = {
      queryType: resultData?.queryType || defaultQueryOptions.queryType,
      dereplicationOptions: defaultQueryOptions.dereplicationOptions,
      detectionOptions:
        resultData?.resultRecord?.detectionOptions ||
        defaultQueryOptions.detectionOptions,
      elucidationOptions:
        resultData?.resultRecord?.elucidationOptions ||
        defaultQueryOptions.elucidationOptions,
      retrievalOptions: {
        action: '',
        resultID: resultData?.resultRecord.id || '',
        resultName: resultData?.resultRecord.name || '',
      },
    };

    return _queryOptions;
  }, [resultData]);

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
        initialValues={queryOptions}
        validate={validateQueryOptions}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit({ queryOptions: values });
          setSubmitting(false);
        }}
        enableReinitialize={true}
      >
        {() => {
          return (
            <Form>
              <QueryTabs />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default QueryPanel;
