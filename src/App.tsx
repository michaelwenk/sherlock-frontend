import './App.scss';

import NMRium from 'nmrium';
import { useCallback, useState } from 'react';
import { Molecule } from 'openchemlib/full';
import Spinner from './component/elements/Spinner';
import SplitPane from 'react-split-pane';
import QueryPanel from './component/panels/queryPanel/QueryPanel';
import ResultsPanel from './component/panels/resultsPanel/ResultsPanel';
import axios from 'axios';
import {Types} from "nmr-correlation"

export interface File {
  binary: ArrayBuffer;
  name: string;
  extension?: string;
}

export interface Data1D {
  y: Array<number>;
  x: Array<number>;
  re: Array<number>;
  im: Array<number>;
}

export interface Display1D {
  name: string;
  color: string;
  isVisible: boolean;
  isPeaksMarkersVisible: boolean;
  isRealSpectrumVisible: boolean;
  isVisibleInDomain: boolean;
}

export interface Info1D {
  nucleus: Array<string>;
  isFid: boolean;
  isComplex: boolean;
  dimension: number;
  isFt: boolean;
}
export interface Peak1D {
  id: string;
  delta: number;
  originDelta: number;
  width: number;
}
export interface Peaks1D {
  values: Array<Partial<Peak1D>>;
  options: any;
}
export interface Integral1D {
  id: string;
  originFrom: number;
  originTo: number;
  from: number;
  to: number;
  absolute: number;
  integral: number;
  kind: string;
}
export interface Integrals1D {
  values: Array<Partial<Integral1D>>;
  options: Partial<{ sum: number }>;
}

export interface Signal1D {
  id: string;
  kind: string;
  originDelta?: number;
  delta: number;
  multiplicity: string;
  peak?: Array<Partial<{ x: number; intensity: number; width: number }>>;
}
export interface Range {
  id: string;
  originFrom?: number;
  originTo?: number;
  from: number;
  to: number;
  absolute: number;
  integral: number;
  kind: string;
  signal?: Array<Partial<Signal1D>>;
}

export interface Ranges {
  values: Array<Partial<Range>>;
  options: Partial<{ sum: number }>;
}

export interface Source {
  jcampURL: string;
  file: File;
}

export interface Datum1D {
  id: string | number;
  source?: Partial<Source>;
  display?: Partial<Display1D>;
  info: Partial<Info1D>;
  originalInfo?: Partial<Info1D>;
  meta?: any;
  data: Data1D;
  originalData?: Data1D;
  peaks?: Peaks1D;
  integrals?: Integrals1D;
  ranges: Ranges;
  filters?: any;
}

export interface Data2D {
  z: Array<Array<number>>;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ContourOptions2D {
  positive: {
    contourLevels: [number, number];
    numberOfLayers: number;
  };
  negative: {
    contourLevels: [number, number];
    numberOfLayers: number;
  };
}

export interface Display2D {
  name: string;
  positiveColor: string;
  negativeColor: string;
  isVisible: boolean;
  isPositiveVisible: boolean;
  isNegativeVisible: boolean;
  contourOptions: ContourOptions2D;
  isVisibleInDomain: boolean;
}

export interface Info2D {
  nucleus: Array<string>;
  isFid: boolean;
  isComplex: boolean;
  dimension: number;
  isFt: boolean;
}

export interface Signal2D {
  id: number;
  peak: any;
  x: Partial<{
    originDelta: number;
    delta: number;
    diaID: any;
  }>;
  y: Partial<{
    originDelta: number;
    delta: number;
    diaID: any;
  }>;
  kind: string;
}

export interface Zone {
  id: number;
  x: Partial<{ from: number; to: number }>;
  y: Partial<{ from: number; to: number }>;
  signal: Array<Signal2D>;
  kind: string;
}

export interface Zones {
  values: Array<Partial<Zone>>;
  options?: Partial<{ sum: number }>;
}

export interface Datum2D {
  id: string | number;
  source?: Partial<Source>;
  display?: Display2D;
  info: Partial<Info2D>;
  originalInfo?: Partial<Info2D>;
  meta?: any;
  data: Data2D;
  originalData?: Data2D;
  zones: Zones;
  filters?: any;
  processingController?: any;
}

export type Spectra = Array<Partial<Datum1D> | Partial<Datum2D>>;

export interface State {
  data: Spectra;
  contours: any;
  tempData: any;
  xDomain: Array<number>;
  yDomain: Array<number>;
  yDomains: any;
  xDomains: any;
  originDomain: any;
  integralsYDomains: any;
  originIntegralYDomain: any;
  activeTab: any;
  width: any;
  height: any;
  margin: Partial<{ top: number; right: number; bottom: number; left: number }>;
  activeSpectrum: any;
  mode: string;
  zoomFactor: Partial<{ scale: number }>;
  integralZoomFactor: Partial<{ scale: number }>;
  molecules: Array<any>;
  verticalAlign: Partial<{
    flag: boolean;
    stacked: boolean;
    value: number;
  }>;
  history: Partial<{
    past: Array<any>;
    present: any;
    future: Array<any>;
    hasUndo: boolean;
    hasRedo: boolean;
  }>;
  isLoading: boolean;
  preferences: any;
  keysPreferences: any;
  displayerMode: any;
  tabActiveSpectrum: any;
  spectraAnalysis: any;
  displayerKey: any;
  correlations: Types.CorrelationData;
  ZoomHistory: any;
  overDisplayer: boolean;

  toolOptions: {
    selectedTool: any;
    selectedOptionPanel: any;

    data: {
      baseLineZones: any;
      exclusionZones: {
        [key: string]: Array<{ id: string; from: number; to: number }>;
      };
      pivot: number;
      zonesNoiseFactor: number;
    };
  };
}


const preferences = {};

// const initData = {};

const minWidth = {
  leftPanel: '25%',
  rightPanel: '25%',
  resizer: '15px',
};

// ###########

export interface Meta { 
    id: string | number,
    rmsd: number,
    smiles: string,     
    mf: string,
    title: string,
  }

export interface Data {
  spectra: Spectra,
  correlations: Types.CorrelationData,
}

export interface ResultMolecule {
  molfile: string,
  meta: Meta,
}

export interface Result {
  molecules: Array<ResultMolecule>
  resultID?: string,
  time?: number,
}

// ###########

export interface WebCaseDataSet {
  structure: any,
  spectrum: any,
  assignment: any,
  meta: Meta,
}

export interface WebCaseResult {
  dataSetList: Array<WebCaseDataSet>
}

function App() {
  const [data, setData] = useState<Data>();
  const [result, setResult] = useState<Result>();
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>();
  const [hideLeftPanel, setHideLeftPanel] = useState<boolean>(false);
  const [hideRightPanel, setHideRightPanel] = useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [showQueryPanel, setShowQueryPanel] = useState<boolean>(true);
  const [requestWasSuccessful, setRequestWasSuccessful] = useState<boolean>();

  const handleOnDataChange = useCallback(function (nmriumData : State) {
    console.log(nmriumData);
    const _spectra : Spectra =
      nmriumData && nmriumData.data
        ? nmriumData.data.reduce<Spectra>((acc, spectrum) => {
            if (spectrum.id && spectrum.info && spectrum.info.isFid === false) {
              if (spectrum.info.dimension === 1) {
                 const _spectrum : Datum1D = {
                id: spectrum.id,
                info: spectrum.info,
                ranges: (spectrum as Datum1D).ranges,
                data: (spectrum as Datum1D).data,
              };
                acc.push(_spectrum);                
              }  else if (spectrum.info.dimension === 2) {
                   const _spectrum : Datum2D = {
                id: spectrum.id,
                info: spectrum.info,
                zones: (spectrum as Datum2D).zones,
                data: (spectrum as Datum2D).data,
              }
                   acc.push(_spectrum);
            }
            
          } ; return acc;}, [])
        : [];
    // console.log(_spectra);
    setData({ spectra: _spectra, correlations: nmriumData.correlations });
  }, []);

  const handleOnSubmit = useCallback(
    async (
      queryType,
      dereplicationOptions,
      elucidationOptions,
      retrievalOptions,
    ) => {
      setIsRequesting(true);
      setShowQueryPanel(false);

      const requestData = {
        data,
        queryType,
        dereplicationOptions,
        elucidationOptions,
        resultID: retrievalOptions.resultID,
      };
      console.log(requestData);

      const t0 = performance.now();
      let response: any;
      await axios({
        method: 'POST',
        url: 'http://localhost:8081/webcase-core/core',
        // params: {},
        data: requestData,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res: any) => {
          setRequestWasSuccessful(true);          
          response = res;
        })
        .catch(() => {
          console.log("FAILED!!!");
          setRequestWasSuccessful(false);
        })
        .finally(() => setIsRequesting(false));
      const t1 = performance.now();
      console.log('time need: ' + (t1 - t0) / 1000);
      console.log(response);

      const molecules : Array<ResultMolecule> =
        response && response.data && response.data.dataSetList
          ? (response.data.dataSetList as Array<WebCaseDataSet>).map((dataSet) => {
              const molecule: Molecule = Molecule.fromSmiles(dataSet.meta.smiles);
              const { formula } = molecule.getMolecularFormula();
              return {
                molfile: molecule.toMolfileV3(),
                meta: { ...dataSet.meta, mf: formula },
              };
            })
          : [];

      setResult({
        molecules,
        resultID: response ? response.data.resultID : undefined,
        time: (t1 - t0) / 1000,
      });
    },
    [data],
  );

  const handleOnDragFinished = useCallback((width) => {
    setLeftPanelWidth(width);
  }, []);

  const handleOnDoubleClickResizer = useCallback(
    (e) => {
      e.stopPropagation();
      if (!hideLeftPanel && !hideRightPanel) {
        if (leftPanelWidth && leftPanelWidth < 0.5 * window.innerWidth) {
          setHideLeftPanel(true);
          setHideRightPanel(false);
        } else {
          setHideLeftPanel(false);
          setHideRightPanel(true);
        }
      } else {
        setHideLeftPanel(false);
        setHideRightPanel(false);
      }
    },
    [hideLeftPanel, hideRightPanel, leftPanelWidth],
  );

  return (
    <div className="app">
      <div className="app-header">
        <p>Welcome to WebCASE !!!</p>
      </div>
      <div className="app-body">
        <SplitPane
          split="vertical"
          defaultSize="80%"
          pane1Style={
            hideLeftPanel
              ? { display: 'none' }
              : hideRightPanel
              ? {
                  maxWidth: '100%',
                  width: `calc(100% - ${minWidth.resizer})`,
                }
              : {
                  height: '100%',
                  maxWidth: `calc(100% - ${minWidth.rightPanel} - ${minWidth.resizer})`,
                  minWidth: minWidth.leftPanel,
                }
          }
          pane2Style={
            hideRightPanel
              ? { display: 'none' }
              : hideLeftPanel
              ? {
                  maxWidth: '100%',
                  width: `calc(100% - ${minWidth.resizer})`,
                }
              : {
                  height: '100%',
                  minWidth: minWidth.rightPanel,
                  maxWidth: `calc(100% - ${minWidth.leftPanel})`,
                }
          }
          onResizerDoubleClick={handleOnDoubleClickResizer}
          // onDragStarted={() => {
          //   console.log('onDragStarted');
          // }}
          onDragFinished={handleOnDragFinished}
        >
          <div className="nmrium-container">
            <NMRium
              preferences={preferences}
              onDataChange={handleOnDataChange}
              // data={initData}
            />
          </div>
          <div className="panels">
            <button
              type="button"
              className="collapsible"
              style={{ '--sign': (showQueryPanel ? '"\\2796"' : '"\\2795"')} as React.CSSProperties }
              onClick={(e) => {
                e.stopPropagation();
                setShowQueryPanel(!showQueryPanel);
              }}
            >
              {showQueryPanel ? 'Hide query options' : 'Show query options'}
            </button>

            <QueryPanel
              onSubmit={handleOnSubmit}
              isRequesting={isRequesting}
              show={showQueryPanel}
            />
            {!showQueryPanel &&
              (isRequesting === true ? (
                <div className="spinner">
                  <Spinner />
                </div>
              ) : requestWasSuccessful === false ? (
                <div className="requestError">
                  <p>Request failed</p>
                </div>
              ) : (
                <ResultsPanel
                  result={result ?? {molecules: []}}
                  onClickClear={() => setResult({molecules: [] })}
                />
              ))}
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
