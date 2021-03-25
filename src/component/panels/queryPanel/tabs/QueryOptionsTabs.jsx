import 'react-tabs/style/react-tabs.css';

/** @jsxImportSource @emotion/react */
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import QueryTabDereplication from './QueryOptionsTabDereplication';
import { useCallback } from 'react';
import { DefaultTolerance, QueryTypes } from '../constants';
import QueryTabElucidation from './QueryOptionsTabElucidation';
import QueryOptionsTabRetrieval from './QueryOptionsTabRetrieval';

function QueryOptionsTabs({ onSelectTab }) {
  // const [queryType, setQueryType] = useState(QueryTypes.dereplication);
  const handleOnSelectTab = useCallback(
    (index) => {
      switch (index) {
        case 0:
          // setQueryType(QueryTypes.dereplication);
          onSelectTab(QueryTypes.dereplication);
          break;
        case 1:
          // setQueryType(QueryTypes.elucidation);
          onSelectTab(QueryTypes.elucidation);
          break;
        case 2:
          // setQueryType(QueryTypes.retrieval);
          onSelectTab(QueryTypes.retrieval);
          break;

        default:
          // setQueryType(QueryTypes.unknown);
          onSelectTab(QueryTypes.unknown);
          break;
      }
    },
    [onSelectTab],
  );

  return (
    <div className="query-tabs">
      <Tabs onSelect={handleOnSelectTab}>
        <TabList>
          <Tab>Dereplication</Tab>
          <Tab>Elucidation</Tab>
          <Tab>Retrieval</Tab>
        </TabList>
        <TabPanel>
          <QueryTabDereplication
            tolerance={DefaultTolerance}
            onChangeTolerance={() => {}}
          />
        </TabPanel>
        <TabPanel>
          <QueryTabElucidation />
        </TabPanel>
        <TabPanel>
          <QueryOptionsTabRetrieval />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default QueryOptionsTabs;
