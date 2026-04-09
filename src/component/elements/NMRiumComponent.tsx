import './NMRiumComponent.css';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';

import { useMemo, useRef } from 'react';
import {
  NMRium,
  NMRiumChangeCb,
  NMRiumPreferences,
  NMRiumRefAPI,
} from 'nmrium';

const preferences: NMRiumPreferences = {
  display: {
    toolBarButtons: {
      import: true,
      rangePicking: true,
      zonePicking: true,
      exportAs: true,
    },
    panels: {
      spectraPanel: { display: true, visible: true, open: true },
      processingsPanel: { display: true, visible: true, open: false },
      informationPanel: { display: false, visible: true, open: false },
      rangesPanel: { display: true, visible: true, open: true },
      zonesPanel: { display: true, visible: true, open: true },
      summaryPanel: { display: true, visible: true, open: true },
    },
  },
};

type InputProps = {
  onChange: NMRiumChangeCb;
};

function NMRiumComponent({ onChange }: InputProps) {
  const nmriumRef = useRef<NMRiumRefAPI>(null);

  return useMemo(
    () => (
      <div className="nmrium-component">
        <NMRium ref={nmriumRef} preferences={preferences} onChange={onChange} />
      </div>
    ),
    [onChange],
  );
}

export default NMRiumComponent;
