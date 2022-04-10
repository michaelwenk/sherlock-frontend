import './Sherlock.scss';
import logoMinimal from '/Sherlock_minimal.png';

import { Tab, Tabs } from 'react-bootstrap';
import NMRium, { NMRiumPreferences } from 'nmrium';
import Panels from './panels/Panels';
import { Reducer, useCallback, useMemo, useReducer } from 'react';
import { DispatchProvider } from '../context/DispatchContext';
import { DataProvider } from '../context/DataContext';
import {
  DataReducer,
  dispatcher,
  initialState,
  initState,
} from '../context/Reducer';
import { SET_NMRIUM_DATA } from '../context/ActionTypes';
import NMRiumData from '../types/nmrium/NMRiumData';
import DataState from '../types/DataState';
import { State } from 'nmrium/lib/component/reducer/Reducer';
import Graph2D from './elements/Graph2D';

const preferences: NMRiumPreferences = {
  panels: {
    // not necessarily needed
    filtersPanel: { display: false },
    integralsPanel: { display: false },
    multipleSpectraAnalysisPanel: { display: false },
    peaksPanel: { display: false },
    structuresPanel: { display: false },
    predictionPanel: { display: false },
    // substantial for CASE
    spectraPanel: { display: true, open: true },
    informationPanel: { display: true },
    rangesPanel: { display: true },
    zonesPanel: { display: true },
    summaryPanel: { display: true },
    databasePanel: { display: false },
  },
};

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
                  onDataChange={handleOnNMRiumDataChange}
                />
              </div>
            </Tab>

            <Tab eventKey="case" title="CASE">
              <Panels />
            </Tab>
            <Tab eventKey="about" title="About">
              <Graph2D />
            </Tab>
          </Tabs>
        </DataProvider>
      </DispatchProvider>
    </div>
  );
}
export default Sherlock;
