import './NMRiumComponent.css';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';

import { useEffect, useMemo, useState } from 'react';
import { NMRium, NMRiumState } from 'nmrium';
import preferences from '../../constants/defaultNMRiumPreferences';

import plugins from '@zakodium/nmrium-core-plugins';
import { CoreReadReturn } from '@zakodium/nmrium-core';
import { useData } from '../../context/DataContext';

const core = plugins();

function NMRiumComponent() {
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

  const { nmriumState } = useData();

  const [coreRead, setCoreRead] = useState<CoreReadReturn | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchData = async (_nmriumState: Partial<NMRiumState>) => {
      const serializedNmriumState = core.serializeNmriumState(
        _nmriumState as NMRiumState,
      );
      console.log(serializedNmriumState);
      const _coreRead = await core.readNMRiumObject(serializedNmriumState, {
        onLoadProcessing: { autoProcessing: true },
        experimentalFeatures: true,
        selector: { general: { dataSelection: 'preferFT' } },
      });
      console.log('containsNmrium:', _coreRead.containsNmrium);
      console.log('state from file:', _coreRead.state);
      console.log('aggregator from file:', _coreRead.aggregator);
      setCoreRead(_coreRead);
    };

    fetchData({
      ...nmriumState,
    });
  }, [nmriumState]);

  return useMemo(
    () => (
      <div className="nmrium-component">
        <NMRium
          preferences={preferences}
          state={coreRead?.state}
          aggregator={coreRead?.aggregator}
          // onChange={handleOnNMRiumChange}
        />
      </div>
    ),
    [coreRead?.aggregator, coreRead?.state],
  );
}

export default NMRiumComponent;
