import './QueryTabs.scss';

import QueryTabDereplication from './QueryTabDereplication';
import QueryTabRetrieval from './QueryTabRetrieval';
import queryTypes from '../../../../constants/queryTypes';
import QueryTabElucidation from './QueryTabElucidation';
import { Tab, Tabs } from 'react-bootstrap';
import capitalize from '../../../../utils/capitalize';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';

interface InputProps {
  reset: boolean;
  // eslint-disable-next-line no-unused-vars
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

  return (
    <div className="query-tabs">
      <Tabs
        defaultActiveKey="dereplication"
        className="custom-tabs nav-justified"
        style={{ flexWrap: 'nowrap' }}
      >
        <Tab
          eventKey={queryTypes.dereplication}
          title={capitalize(queryTypes.dereplication)}
        >
          <div className="query-tab-dereplication">
            <QueryTabDereplication />
          </div>
        </Tab>
        <Tab
          eventKey={queryTypes.elucidation}
          title={capitalize(queryTypes.elucidation)}
        >
          <div className="query-tab-elucidation">
            <QueryTabElucidation />
          </div>
        </Tab>
        <Tab
          eventKey={queryTypes.retrieval}
          title={capitalize(queryTypes.retrieval)}
        >
          <div className="query-tab-retrieval">
            <QueryTabRetrieval />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default QueryTabs;
