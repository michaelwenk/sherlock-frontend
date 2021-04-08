import './QueryPanel.css';

/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { DefaultTolerance, QueryTypes } from './constants';
import QueryOptionsTabs from './tabs/QueryOptionsTabs';
import { Formik, Form } from 'formik';
import validateQueryOptions from '../../../utils/queryOptionsValidation';

function QueryPanel({ onSubmit, isRequesting }) {
  const [queryType, setQueryType] = useState(QueryTypes.dereplication);

  const handleOnSelectTab = useCallback((_queryType) => {
    setQueryType(_queryType);
  }, []);

  return (
    <Formik
      initialValues={{
        dereplicationOptions: {
          shiftTolerances: DefaultTolerance,
          checkMultiplicity: true,
          checkEquivalencesCount: true,
          useMF: true,
        },
        elucidationOptions: {
          allowHeteroHeteroBonds: false,
          useElim: false,
          elimP1: 1, // number of correlations (HMBC/COSY) to eliminate
          elimP2: 4, // number of bonds between the atoms
          hmbcP3: 2, // minimal coupling path length HMBC
          hmbcP4: 4, // maximal coupling path length HMBC
          cosyP3: 3, // minimal coupling path length COSY
          cosyP4: 4, // maximal coupling path length COSY
          useFilterLsdRing3: true,
          useFilterLsdRing4: true,
          hybridizationDetectionThreshold: 0.1,
        },
        retrievalOptions: { resultID: '' },
      }}
      validate={validateQueryOptions}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(
          queryType,
          values.dereplicationOptions,
          values.elucidationOptions,
          values.retrievalOptions,
        );
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="query-panel">
            <div className="tabs-container">
              <QueryOptionsTabs onSelectTab={handleOnSelectTab} />
            </div>
            <div className="submit-button-container">
              <button
                className="submit-button"
                type="submit"
                disabled={isSubmitting}
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
