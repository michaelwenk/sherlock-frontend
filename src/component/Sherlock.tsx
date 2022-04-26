import './Sherlock.scss';
import logoMinimal from '/Sherlock_minimal.png';

import { Tab, Tabs } from 'react-bootstrap';
import NMRium, {
  NMRiumPreferences,
  NMRiumData as NMRiumDataOriginal,
} from 'nmrium';
import Panels from './panels/Panels';
import {
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { DispatchProvider } from '../context/DispatchContext';
import { DataProvider } from '../context/DataContext';
import {
  DataReducer,
  dispatcher,
  initialState,
  initState,
} from '../context/Reducer';
import { SET_IS_RETRIEVING, SET_NMRIUM_DATA } from '../context/ActionTypes';
import DataState from '../types/DataState';
import { State } from 'nmrium/lib/component/reducer/Reducer';
import NMRiumData from '../types/nmrium/NMRiumData';

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
      console.log('HUHU1');

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

  const [data, setData] = useState<NMRiumDataOriginal>({ spectra: [] });
  useEffect(() => {
    console.log(state.isRetrieving);

    if (state.isRetrieving === true) {
      console.log('HUHU2-1');
      const nmriumDataJson =
        state.resultData?.resultRecord.nmriumDataJsonParts?.join('');
      const newNmriumData = JSON.parse(nmriumDataJson || '{}');
      console.log('HUHU2-2');

      setData({
        spectra: newNmriumData?.spectra || [],
        correlations: newNmriumData?.correlations,
      });
      dispatcherMemo({
        type: SET_IS_RETRIEVING,
        payload: { isRetrieving: false },
      });
    }
  }, [
    dispatcherMemo,
    state.isRetrieving,
    state.resultData?.resultRecord.nmriumDataJsonParts,
  ]);

  const nmrium = useMemo(
    () => (
      <NMRium
        preferences={preferences}
        onDataChange={async (d) => handleOnNMRiumDataChange(d)}
        data={data}
      />
    ),
    [data, handleOnNMRiumDataChange],
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
              <div className="nmrium-container">{nmrium}</div>
            </Tab>

            <Tab eventKey="case" title="CASE">
              <Panels />
            </Tab>
            <Tab eventKey="about" title="About" />
          </Tabs>
        </DataProvider>
      </DispatchProvider>
    </div>
  );
}
export default Sherlock;
