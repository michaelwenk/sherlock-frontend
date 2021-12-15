import './QueryPanel.scss';

import React, { useMemo, useState } from 'react';
import QueryTabs from './tabs/QueryTabs';
import { Formik, Form } from 'formik';
import validateQueryOptions from '../../../utils/queryOptionsValidation';
import defaultQueryOptions from '../../../constants/defaultQueryOptions';
import Button from '../../elements/Button';
import queryTypes from '../../../constants/queryTypes';
import { QueryOptions } from '../../../types/QueryOptions';
import { useData } from '../../../context/DataContext';
import capitalize from '../../../utils/capitalize';
import ConfirmModal from '../../elements/modal/ConfirmModal';

type InputProps = {
  onSubmit: Function;
  isRequesting: boolean;
  show: boolean;
};

function QueryPanel({ onSubmit, isRequesting, show }: InputProps) {
  const { resultData } = useData();
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

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
        {({ setFieldValue, submitForm, values }) => {
          return (
            <Form>
              <div className="form-tabs-container">
                <QueryTabs
                  onSelectTab={(queryType: string) =>
                    setFieldValue('queryType', queryType)
                  }
                />
                {capitalize(values.queryType) !== queryTypes.retrieval && (
                  <Button
                    onClick={() => {
                      if (!values.detectionOptions.useHybridizationDetections) {
                        setShowConfirmDialog(true);
                      } else {
                        submitForm();
                      }
                    }}
                    child={capitalize(values.queryType)}
                    disabled={isRequesting}
                  />
                )}
              </div>

              <ConfirmModal
                show={showConfirmDialog}
                title="Start elucidation without set or detected hybridizations?"
                onCancel={() => setShowConfirmDialog(false)}
                onConfirm={() => {
                  setShowConfirmDialog(false);
                  submitForm();
                }}
                body={
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'blue',
                    }}
                  >
                    Usually, this leads to longer running time!
                  </p>
                }
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default QueryPanel;
