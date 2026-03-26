import 'react-science/styles/preflight.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import { useMemo } from 'react';
import { NMRium, NMRiumChangeCb, NMRiumPreferences } from 'nmrium';

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

type InputProps = {
  onChange: NMRiumChangeCb;
};

function NMRiumComponent({ onChange }: InputProps) {
  return useMemo(
    () => (
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 50px)',
          position: 'absolute',
        }}
      >
        <NMRium preferences={preferences} onChange={onChange} />
      </div>
    ),
    [onChange],
  );
}

export default NMRiumComponent;
