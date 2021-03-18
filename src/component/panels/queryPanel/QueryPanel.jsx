/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import CheckBox from '../../elements/CheckBox';
import './QueryPanel.css';
import Tolerances from './Tolerances';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DefaultTolerance, QueryTypes } from './Constants';

function QueryPanel({ onSubmit, isRequesting }) {
  const [queryType, setQueryType] = useState(QueryTypes.dereplication);
  const [allowHeteroHeteroBonds, setAllowHeteroHeteroBonds] = useState(false);
  const [tolerance, setTolerance] = useState(DefaultTolerance);
  const [retrievalID, setRetrievalID] = useState('');

  const handleOnSubmit = useCallback(
    async (e) => {
      e.stopPropagation();
      onSubmit(queryType, tolerance, allowHeteroHeteroBonds, retrievalID);
    },
    [onSubmit, queryType, tolerance, allowHeteroHeteroBonds, retrievalID],
  );

  const onChangeAllowHeteroHeteroBonds = useCallback((e) => {
    e.stopPropagation();
    setAllowHeteroHeteroBonds(e.target.checked);
  }, []);

  const onChangeToleranceHandler = useCallback((_tolerance) => {
    setTolerance(_tolerance);
  }, []);

  const onSelectTab = useCallback((index) => {
    switch (index) {
      case 0:
        setQueryType(QueryTypes.dereplication);
        break;
      case 1:
        setQueryType(QueryTypes.elucidation);
        break;
      case 2:
        setQueryType(QueryTypes.retrieval);
        break;

      default:
        setQueryType(QueryTypes.unknown);
        break;
    }
  }, []);

  return (
    <div className="query-panel">
      <Tabs onSelect={onSelectTab}>
        <TabList>
          <Tab>Dereplication</Tab>
          <Tab>Elucidation</Tab>
          <Tab>Retrieval</Tab>
        </TabList>
        <TabPanel>
          {queryType && (
            <Tolerances
              tolerance={tolerance}
              onChangeTolerance={onChangeToleranceHandler}
            />
          )}
        </TabPanel>
        <TabPanel>
          <CheckBox
            isChecked={allowHeteroHeteroBonds}
            handleOnChange={onChangeAllowHeteroHeteroBonds}
            title="Allow Hetero-Hetero Bonds"
          />
        </TabPanel>
        <TabPanel>
          <input type="text" onChange={(e) => setRetrievalID(e.target.value)} />
        </TabPanel>
      </Tabs>

      <button type="button" onClick={handleOnSubmit} disabled={isRequesting}>
        {queryType}
      </button>
    </div>
  );
}

export default QueryPanel;
