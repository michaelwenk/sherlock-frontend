import './QueryPanel.scss';

import React, { memo, useEffect, useMemo, useState } from 'react';
import QueryTabs from './tabs/QueryTabs';
import { Formik, Form, FormikHelpers } from 'formik';
import validateQueryOptions from '../../../utils/queryOptionsValidation';
import defaultQueryOptions from '../../../constants/defaultQueryOptions';
import QueryOptions from '../../../types/QueryOptions';
import { useData } from '../../../context/DataContext';

type InputProps = {
  onSubmit: (values: { queryOptions: QueryOptions }) => void;
  show: boolean;
};

function QueryPanel({ onSubmit, show }: InputProps) {
  const { resultData } = useData();
  // work-around since Formik does not always update its values property
  // even if enableReinitialize is set to true
  const [reset, setReset] = useState<boolean>(false);

  const queryOptions = useMemo((): QueryOptions => {
    const _queryOptions: QueryOptions = {
      queryType: resultData?.queryType || defaultQueryOptions.queryType,
      dereplicationOptions:
        resultData?.dereplicationOptions ||
        defaultQueryOptions.dereplicationOptions,
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

  useEffect(() => {
    function _setReset(value: boolean) {
      setReset(value);
    }

    _setReset(true);
  }, [resultData]);

  return useMemo(
    () => (
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
          onSubmit={(
            values: QueryOptions,
            { setSubmitting }: FormikHelpers<QueryOptions>,
          ) => {
            onSubmit({ queryOptions: values });
            setSubmitting(false);
          }}
          enableReinitialize={true}
        >
          {() => {
            return (
              <Form>
                <QueryTabs reset={reset} setReset={setReset} />
              </Form>
            );
          }}
        </Formik>
      </div>
    ),
    [onSubmit, queryOptions, reset, show],
  );
}

export default memo(QueryPanel);
