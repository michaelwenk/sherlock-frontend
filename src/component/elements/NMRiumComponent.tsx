import './NMRiumComponent.css';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';

import { useEffect, useState } from 'react';
import { NMRium, NMRiumState } from 'nmrium';
import preferences from '../../constants/defaultNMRiumPreferences';

import plugins from '@zakodium/nmrium-core-plugins';
import { CoreReadReturn, ParsingOptions } from '@zakodium/nmrium-core';
import { useData } from '../../context/DataContext';

const core = plugins();

const parsingOptions: ParsingOptions = {
  onLoadProcessing: { autoProcessing: true },
  experimentalFeatures: true,
  selector: { general: { dataSelection: 'preferFT' } },
};

function useLoadNMRiumData() {
  const { nmriumState } = useData();

  const [parsedNmriumData, setParsedNmriumData] = useState<
    CoreReadReturn | undefined
  >(undefined);

  useEffect(() => {
    async function load() {
      const serializedState = core.serializeNmriumState(
        nmriumState as NMRiumState,
      );
      const parseResult = await core.readNMRiumObject(
        serializedState,
        parsingOptions,
      );
      setParsedNmriumData(parseResult);
    }

    void load();
  }, [nmriumState]);

  return parsedNmriumData;
}
export function NMRiumComponent() {
  // const dispatch = useDispatch();

  // const handleOnNMRiumChange = useCallback<NMRiumChangeCb>(
  //   (state: NMRiumState, source: 'data' | 'view' | 'settings') => {
  //     if (source === 'data') {
  //       // dispatch({
  //       //   type: SET_NMRIUM_STATE,
  //       //   payload: { nmriumState: state },
  //       // });
  //       console.log('NMRium state updated from NMRiumComponent');
  //     }
  //   },
  //   [],
  // );
  const data = useLoadNMRiumData();

  return (
    <NMRium
      preferences={preferences}
      state={data?.state}
      aggregator={data?.aggregator}
      // onChange={handleOnNMRiumChange}
    />
  );
}
