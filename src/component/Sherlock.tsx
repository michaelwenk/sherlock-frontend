import './Sherlock.scss';
import logoMinimal from '/Sherlock_minimal.png';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {
  NMRiumChangeCb,
  NMRiumData,
  NMRium,
  NMRiumPreferences,
  NMRiumState,
} from 'nmrium';
import Panels from './panels/Panels';
import { memo, useCallback, useMemo, useReducer } from 'react';
import { DispatchProvider } from '../context/DispatchContext';
import { DataProvider } from '../context/DataContext';
import { DataReducer, dispatcher, initialState } from '../context/Reducer';
import { SET_NMRIUM_DATA } from '../context/ActionTypes';
import HelpPanel from './panels/HelpPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
('@fortawesome/react-fontawesome');
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

const preferences: NMRiumPreferences = {
  display: {
    toolBarButtons: { import: true },
    panels: {
      spectraPanel: { display: true, visible: true },
      rangesPanel: { display: true, visible: true },
      zonesPanel: { display: true, visible: true },
      summaryPanel: { display: true, visible: true },
    },
  },
};

function Sherlock() {
  const [state, dispatch] = useReducer(DataReducer, initialState);

  const dispatcherMemo = useMemo(() => dispatcher(dispatch), []);

  const handleOnNMRiumChange: NMRiumChangeCb = useCallback(
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

  return useMemo(
    () => (
      <div className="sherlock">
        <DispatchProvider value={dispatcherMemo}>
          <DataProvider value={state}>
            <Tabs defaultActiveKey="nmrium" className="nav-justified">
              <Tab
                eventKey="logo"
                title={
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
                }
                disabled={true}
              />
              <Tab eventKey="nmrium" title="Spectra">
                <div className="nmrium-container">
                  <NMRium
                    preferences={preferences}
                    onChange={handleOnNMRiumChange}
                  />
                </div>
              </Tab>

              <Tab eventKey="case" title="CASE">
                <Panels />
              </Tab>
              <Tab
                eventKey="help"
                title={<FontAwesomeIcon icon={faQuestion} title="Help" />}
              >
                <HelpPanel />
              </Tab>
            </Tabs>
          </DataProvider>
        </DispatchProvider>
      </div>
    ),
    [dispatcherMemo, handleOnNMRiumChange, state],
  );
}
export default memo(Sherlock);
