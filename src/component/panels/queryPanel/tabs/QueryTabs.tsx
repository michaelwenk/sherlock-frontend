import './QueryTabs.scss';

import QueryTabDereplication from './QueryTabDereplication';
import { useCallback } from 'react';
import QueryTabRetrieval from './QueryTabRetrieval';
import queryTypes from '../../../../constants/queryTypes';
import QueryTabElucidation from './QueryTabElucidation';
import { Tab, Tabs } from 'react-bootstrap';
import capitalize from '../../../../utils/capitalize';

type InputProps = {
  onSelectTab: Function;
};

function QueryOptionsTabs({ onSelectTab }: InputProps) {
  const handleOnSelectTab = useCallback(
    (queryType) => {
      onSelectTab(queryType);
    },
    [onSelectTab],
  );

  return (
    <div className="query-tabs">
      <Tabs onSelect={handleOnSelectTab} defaultActiveKey="dereplication">
        <Tab
          eventKey={queryTypes.dereplication}
          title={capitalize(queryTypes.dereplication)}
        >
          <QueryTabDereplication />
        </Tab>
        <Tab
          eventKey={queryTypes.elucidation}
          title={capitalize(queryTypes.elucidation)}
        >
          <QueryTabElucidation />
        </Tab>
        <Tab
          eventKey={queryTypes.retrieval}
          title={capitalize(queryTypes.retrieval)}
        >
          <QueryTabRetrieval />
        </Tab>
      </Tabs>
    </div>
  );
}

export default QueryOptionsTabs;
