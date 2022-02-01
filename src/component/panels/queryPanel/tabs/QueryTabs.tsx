import './QueryTabs.scss';

import QueryTabDereplication from './QueryTabDereplication';
import QueryTabRetrieval from './QueryTabRetrieval';
import queryTypes from '../../../../constants/queryTypes';
import QueryTabElucidation from './QueryTabElucidation';
import { Tab, Tabs } from 'react-bootstrap';
import capitalize from '../../../../utils/capitalize';

function QueryOptionsTabs() {
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

export default QueryOptionsTabs;
