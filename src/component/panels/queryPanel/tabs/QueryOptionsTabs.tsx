import 'react-tabs/style/react-tabs.css';

import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import QueryTabDereplication from './QueryOptionsTabDereplication';
import { useCallback } from 'react';

import QueryTabElucidation from './QueryOptionsTabElucidation';
import QueryOptionsTabRetrieval from './QueryOptionsTabRetrieval';
import queryTypes from '../../../../constants/queryTypes';

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

        default:
          onSelectTab(queryTypes.unknown);
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
