import 'react-tabs/style/react-tabs.css';

/** @jsxImportSource @emotion/react */
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import QueryTabDereplication from './QueryOptionsTabDereplication';
import { useCallback } from 'react';
import { QueryTypes } from '../constants';
import QueryTabElucidation from './QueryOptionsTabElucidation';
import QueryOptionsTabRetrieval from './QueryOptionsTabRetrieval';

function QueryOptionsTabs({ onSelectTab }) {
  const handleOnSelectTab = useCallback(
    (index) => {
      switch (index) {
        case 0:
          onSelectTab(QueryTypes.dereplication);
          break;
        case 1:
          onSelectTab(QueryTypes.elucidation);
          break;
        case 2:
          onSelectTab(QueryTypes.retrieval);
          break;

        default:
          onSelectTab(QueryTypes.unknown);
          break;
      }
    },
    [onSelectTab],
  );

  return (
    <Tabs onSelect={handleOnSelectTab}>
      <TabList>
        <Tab>Dereplication</Tab>
        <Tab>Elucidation</Tab>
        <Tab>Retrieval</Tab>
      </TabList>
      <TabPanel>
        <QueryTabDereplication />
      </TabPanel>
      <TabPanel>
        <QueryTabElucidation />
      </TabPanel>
      <TabPanel>
        <QueryOptionsTabRetrieval />
      </TabPanel>
    </Tabs>
  );
}

export default QueryOptionsTabs;
