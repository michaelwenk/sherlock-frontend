import './Sherlock.scss';
import logoMinimal from '/Sherlock_minimal.png';

import { Tab, Tabs } from 'react-bootstrap';
import NMRium from '@michaelwenk/nmrium';
import Panels from './panels/Panels';
import { Reducer, useCallback, useMemo, useReducer } from 'react';
import { DispatchProvider } from '../context/DispatchContext';
import { DataProvider } from '../context/DataContext';
import { State } from '@michaelwenk/nmrium/lib/component/reducer/Reducer';
import {
  DataReducer,
  dispatcher,
  initialState,
  initState,
} from '../context/Reducer';
import { SET_NMRIUM_DATA } from '../context/ActionTypes';
import NMRiumData from '../types/nmrium/NMRiumData';
import DataState from '../types/DataState';
import Button from './elements/Button';

const preferences = {};

function Sherlock() {
  const [state, dispatch] = useReducer<Reducer<DataState, any>, DataState>(
    DataReducer,
    initialState,
    initState,
  );

  const dispatcherMemo = useMemo(() => {
    return dispatcher(dispatch);
  }, []);

  const handleOnNMRiumDataChange = useCallback(
    function (nmriumData: State) {
      const _nmriumData: NMRiumData = {
        spectra: nmriumData.data,
        correlations: nmriumData.correlations,
      };
      dispatcherMemo({
        type: SET_NMRIUM_DATA,
        payload: { nmriumData: _nmriumData },
      });
    },
    [dispatcherMemo],
  );

  return (
    <div className="sherlock">
      <div className="sherlock-body">
        <Tabs defaultActiveKey="nmrium" className="nav-justified">
          <Tab
            eventKey="logo"
            title={
              <div
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  onClick={() => {
                    location.reload();
                  }}
                  child={<img src={logoMinimal} width="100%" />}
                  style={{ border: 'none' }}
                />
              </div>
            }
          />
          <Tab eventKey="nmrium" title="Spectra">
            <div className="nmrium-container">
              <NMRium
                preferences={preferences}
                onDataChange={handleOnNMRiumDataChange}
              />
            </div>
          </Tab>
          <Tab eventKey="case" title="CASE">
            <DispatchProvider value={dispatcherMemo}>
              <DataProvider value={state}>
                <Panels />
              </DataProvider>
            </DispatchProvider>
          </Tab>
          <Tab eventKey="about" title="About"></Tab>
        </Tabs>
      </div>
    </div>
  );
}
export default Sherlock;
