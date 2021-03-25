import './ResultsPanel.css';

/** @jsxImportSource @emotion/react */
import { Molecule } from 'openchemlib/full';
import { Fragment, useCallback, useMemo } from 'react';
import { saveAs } from 'file-saver';
import ResultsContainer from './resultsContainer/ResultsContainer';
import ResultsInfo from './resultsInfo/ResultsInfo';
import Spinner from '../../elements/Spinner';

function ResultsPanel({ results, isRequesting }) {
  const queryType = useMemo(() => {
    return results ? results.data.queryType : '';
  }, [results]);

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
      {isRequesting ? (
        <div className="loader">
          <Spinner />
        </div>
      ) : (
        <Fragment>
          <ResultsInfo
            results={results}
            onClickDownload={handleOnClickDownload}
          />
          <ResultsContainer
            molecules={molecules}
            limit={50}
            queryType={queryType}
          />
        </Fragment>
      )}
    </div>
  );
}

export default ResultsPanel;
