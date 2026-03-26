import './Sherlock.scss';
import logoMinimal from '/Sherlock_minimal.png';

import { NMRiumChangeCb, NMRiumData, NMRiumState } from 'nmrium';
import Panels from './panels/Panels';
import { memo, useCallback, useMemo, useReducer } from 'react';
import { DispatchProvider } from '../context/DispatchContext';
import { DataProvider } from '../context/DataContext';
import { DataReducer, dispatcher, initialState } from '../context/Reducer';
import { SET_NMRIUM_DATA } from '../context/ActionTypes';
import HelpPanel from './panels/HelpPanel';
import Tabs from './elements/Tabs';
import TabData from '../types/TabData';
import NMRiumComponent from './elements/NMRiumComponent';

const tabWidth = '100px';
const tabHeight = '50px';

function Sherlock() {
  const [state, dispatch] = useReducer(DataReducer, initialState);

  const dispatcherMemo = useMemo(() => dispatcher(dispatch), []);

  const handleOnNMRiumChange = useCallback<NMRiumChangeCb>(
    function (nmriumState: NMRiumState) {
      const _nmriumData: NMRiumData = {
        spectra: nmriumState.data.spectra,
        correlations: nmriumState.data.correlations,
      };
      dispatcherMemo({
        type: SET_NMRIUM_DATA,
        payload: { nmriumData: _nmriumData },
      });
    },
    [dispatcherMemo],
  );

  const tabsData: TabData[] = useMemo(
    () => [
      {
        label: 'logo',
        labelOnly: true,
        elem: (
          <img
            src={logoMinimal}
            style={{
              width: '100%',
              maxWidth: '300px',
              display: 'flex',
              justifyContent: 'center',
              border: 'none',
            }}
          />
        ),
      },
      {
        label: 'Spectra',
        elem: <NMRiumComponent onChange={handleOnNMRiumChange} />,
      },
      {
        label: 'CASE',
        elem: <Panels />,
      },
      {
        label: 'Help',
        elem: <HelpPanel />,
      },
    ],
    [handleOnNMRiumChange],
  );

  return useMemo(
    () => (
      <div className="sherlock">
        <DispatchProvider value={dispatcherMemo}>
          <DataProvider value={state}>
            <Tabs
              tabsData={tabsData}
              width={tabWidth}
              height={tabHeight}
              initialActiveTabIndex={1}
            />
          </DataProvider>
        </DispatchProvider>
      </div>
    ),
    [dispatcherMemo, state, tabsData],
  );
}
export default memo(Sherlock);
