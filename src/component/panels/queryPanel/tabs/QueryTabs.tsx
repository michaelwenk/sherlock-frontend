import 'react-tabs/style/react-tabs.css';

import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import QueryTabDereplication from './QueryTabDereplication';
import { useCallback } from 'react';

import QueryTabRetrieval from './QueryTabRetrieval';
import queryTypes from '../../../../constants/queryTypes';
import QueryTabElucidation from './QueryTabElucidation';

type InputProps = {
  onSelectTab: Function;
};

function QueryOptionsTabs({ onSelectTab }: InputProps) {
  const handleOnSelectTab = useCallback(
    (index) => {
      switch (index) {
        case 0:
          onSelectTab(queryTypes.dereplication);
          break;
        case 1:
          onSelectTab(queryTypes.elucidation);
          break;
        case 2:
          onSelectTab(queryTypes.retrieval);
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
        <QueryTabRetrieval />
      </TabPanel>
    </Tabs>
  );
}

export default QueryOptionsTabs;
