import { NMRiumPreferences } from 'nmrium';

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
      structuresPanel: { display: true, visible: true, open: false },
    },
  },
};

export default preferences;
