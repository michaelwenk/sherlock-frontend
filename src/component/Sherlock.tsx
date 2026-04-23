import './Sherlock.css';
import logoMinimal from '/Sherlock_minimal.png';

import Panels from './panels/Panels';
import { memo, useMemo, useReducer } from 'react';
import { DispatchProvider } from '../context/DispatchContext';
import { DataProvider } from '../context/DataContext';
import { DataReducer, dispatcher, initialState } from '../context/Reducer';
import HelpPanel from './panels/HelpPanel';
import NMRiumComponent from './elements/NMRiumComponent';
import { Tab, Tabs } from '@blueprintjs/core';
import styled from '@emotion/styled';

const Container = styled.div`
  height: 100vh;
  width: 100%;

`;
const StyledTabs = styled(Tabs)`
    height: 100%;
    display: flex;
    flex-direction: column;

[role="tabpanel"] {
  flex:1
}   
`;
interface TabData {
  id: string;
  title: React.ReactNode;
  panel?: JSX.Element;
  disabled?: boolean;
}

const LOGO_TAB: TabData = {
  id: 'logo',
  disabled: true,
  title: (
    <a href={import.meta.env.VITE_FRONTEND_URL} target="_self">
      <img
        src={logoMinimal}
        style={{
          minHeight: '50px',
          maxHeight: '50px',
          display: 'flex',
          justifyContent: 'center',
          border: 'none',
        }}
      />
    </a>
  ),
};

const TABS_DATA: TabData[] = [
  LOGO_TAB,
  { id: 'spectra', title: 'Spectra', panel: <NMRiumComponent /> },
  { id: 'case', title: 'CASE', panel: <Panels /> },
  { id: 'help', title: 'Help', panel: <HelpPanel /> },
];

function Sherlock() {
  const [state, dispatch] = useReducer(DataReducer, initialState);
  const dispatcherMemo = useMemo(() => dispatcher(dispatch), []);

  return <DispatchProvider value={dispatcherMemo}>
    <DataProvider value={state}>
      <Container>
        <StyledTabs
          id="sherlock-tabs"
          defaultSelectedTabId="spectra"
          renderActiveTabPanelOnly
        >
          {TABS_DATA.map(({ id, title, panel, disabled }) => (
            <Tab key={id} id={id} title={title} panel={panel} disabled={disabled} />
          ))}
        </StyledTabs>
      </Container>
    </DataProvider>
  </DispatchProvider>


}

export default memo(Sherlock);