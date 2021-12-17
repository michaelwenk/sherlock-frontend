import './QueryPanel.scss';

import React, { useCallback, useMemo, useState } from 'react';
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
  const [queryType, setQueryType] = useState<string>(queryTypes.dereplication);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const handleOnSelectTab = useCallback((type: string) => {
    setQueryType(type);
  }, []);

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
        {({ setFieldValue, submitForm, values, errors }) => {
          return (
            <Form>
              <div className="form-tabs-container">
                <QueryTabs onSelectTab={handleOnSelectTab} />
                {queryType !== queryTypes.retrieval && (
                  <Button
                    onClick={() => {
                      if (!values.detectionOptions.useHybridizationDetections) {
                        setShowConfirmDialog(true);
                      } else {
                        setFieldValue('queryType', queryType);
                        submitForm();
                      }
                    }}
                    child={capitalize(queryType)}
                    disabled={isRequesting || Object.keys(errors).length > 0}
                    style={{
                      color:
                        Object.keys(errors).length > 0 ? 'grey' : 'inherit',
                    }}
                  />
                )}
              </div>

              <ConfirmModal
                show={showConfirmDialog}
                title="Start elucidation without set or detected hybridizations?"
                onCancel={() => setShowConfirmDialog(false)}
                onConfirm={() => {
                  setShowConfirmDialog(false);
                  setFieldValue('queryType', queryType);
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
