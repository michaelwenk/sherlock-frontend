import './WebCASE.scss';

import { Tab, Tabs } from 'react-bootstrap';
import NMRium from 'nmrium';
import Panels from './panels/Panels';
import { Reducer, useCallback, useMemo, useReducer } from 'react';
import { DispatchProvider } from '../context/DispatchContext';
import { DataProvider } from '../context/DataContext';
import { State } from 'nmrium/lib/component/reducer/Reducer';
import {
  DataReducer,
  DataState,
  dispatcher,
  initialState,
  initState,
} from '../context/Reducer';
import { SET_NMRIUM_DATA } from '../context/ActionTypes';
import { NMRiumData } from '../types/nmrium/NMRiumData';

const preferences = {};

function WebCASE() {
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
    <DispatchProvider value={dispatcherMemo}>
      <DataProvider value={state}>
        <div className="webcase">
          <div className="webcase-header">
            <p>Sherlock</p>
          </div>
          <div className="webcase-body">
            <Tabs defaultActiveKey="nmrium" className="tabs-bar">
              <Tab eventKey="nmrium" title="NMRium">
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
              <Tab eventKey="about" title="About"></Tab>
            </Tabs>
          </div>
        </div>
      </DataProvider>
    </DispatchProvider>
  );
}
export default WebCASE;
