import './QueryTabs.scss';

import QueryTabDereplication from './QueryTabDereplication';
import QueryTabRetrieval from './QueryTabRetrieval';
import queryTypes from '../../../../constants/queryTypes';
import QueryTabElucidation from './QueryTabElucidation';
import capitalize from '../../../../utils/capitalize';
import { useFormikContext } from 'formik';
import { memo, useEffect, useMemo } from 'react';
import Tabs from '../../../elements/Tabs';
import TabData from '../../../../types/TabData';

interface InputProps {
  reset: boolean;
  setReset: (reset: boolean) => void;
}

function QueryTabs({ reset, setReset }: InputProps) {
  const { resetForm } = useFormikContext();

  useEffect(() => {
    if (reset) {
      resetForm();
      setReset(false);
    }
  }, [reset, resetForm, setReset]);

  const tabsData: TabData[] = useMemo(
    () => [
      {
        label: capitalize(queryTypes.dereplication),
        elem: (
          <div className="query-tab-dereplication">
            <QueryTabDereplication />
          </div>
        ),
      },

      {
        label: capitalize(queryTypes.elucidation),
        elem: (
          <div className="query-tab-elucidation">
            <QueryTabElucidation />
          </div>
        ),
      },
      {
        label: capitalize(queryTypes.retrieval),
        elem: (
          <div className="query-tab-retrieval">
            <QueryTabRetrieval />
          </div>
        ),
      },
    ],
    [],
  );

  return useMemo(
    () => (
      <div className="query-tabs">
        <Tabs tabsData={tabsData} width="100%" height="50px" />
      </div>
    ),
    [tabsData],
  );
}

export default memo(QueryTabs);
