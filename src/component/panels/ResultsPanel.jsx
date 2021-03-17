/** @jsxImportSource @emotion/react */

import { Molecule } from 'openchemlib/full';
import { useCallback, useMemo } from 'react';
import { saveAs } from 'file-saver';

import 'bootstrap/dist/css/bootstrap.min.css';
import './ResultsPanel.css';
import ResultsContainer from '../elements/ResultsContainer';

function ResultsPanel({ results }) {
  const molecules = useMemo(() => {
    return results && results.dataSetList
      ? results.dataSetList.map((dataSet, i) => {
          const molecule = Molecule.fromSmiles(dataSet.meta.smiles);
          const { formula, relativeWeight } = molecule.getMolecularFormula();
          return {
            molfile: molecule.toMolfileV3(),
            meta: { ...dataSet.meta, mf: formula, mw: relativeWeight },
          };
        })
      : [];
  }, [results]);

  const handleOnClickDownload = useCallback(() => {
    const fileData = JSON.stringify(molecules, undefined, 2);
    const blob = new Blob([fileData], { type: 'text/plain' });
    saveAs(blob, `results.json`);
  }, [molecules]);

  return (
    <div className="results-panel">
      <p>ResultsPanel!!!</p>
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
