/** @jsxImportSource @emotion/react */

import { Molecule } from 'openchemlib/full';
import { useCallback, useMemo } from 'react';
import { saveAs } from 'file-saver';

import 'bootstrap/dist/css/bootstrap.min.css';
import './ResultsPanel.css';
import ResultsContainer from './ResultsContainer';

function ResultsPanel({ results, isRequesting }) {
  const molecules = useMemo(() => {
    return !isRequesting && results && results.data && results.data.dataSetList
      ? results.data.dataSetList.map((dataSet, i) => {
          const molecule = Molecule.fromSmiles(dataSet.meta.smiles);
          const { formula, relativeWeight } = molecule.getMolecularFormula();
          return {
            molfile: molecule.toMolfileV3(),
            meta: { ...dataSet.meta, mf: formula, mw: relativeWeight },
          };
        })
      : [];
  }, [isRequesting, results]);

  const handleOnClickDownload = useCallback(() => {
    const fileData = JSON.stringify(molecules, undefined, 2);
    const blob = new Blob([fileData], { type: 'text/plain' });
    saveAs(
      blob,
      `${
        results && results.data.requestID ? results.data.requestID : 'results'
      }.json`,
    );
  }, [molecules, results]);

  return (
    <div className="results-panel">
      <p>ResultsPanel!!!</p>
      <p>
        {isRequesting
          ? 'Requesting...'
          : molecules.length > 0
          ? results.data.dataSetList.length +
            ' result(s) in ' +
            results.time.toFixed(2) +
            's'
          : 'No results'}
      </p>
      <p>{!isRequesting && results && results.data.requestID}</p>
      <div className="results-container">
        <ResultsContainer molecules={molecules} />
      </div>
      <div className="download-container">
        <button
          type="button"
          onClick={handleOnClickDownload}
          disabled={molecules.length > 0 ? false : true}
        >
          Download Results
        </button>
      </div>
    </div>
  );
}

export default ResultsPanel;
