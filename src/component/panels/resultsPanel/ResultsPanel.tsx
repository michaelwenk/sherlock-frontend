import './ResultsPanel.scss';

import { useCallback, useMemo } from 'react';
import { saveAs } from 'file-saver';
import ResultsInfo from './resultsInfo/ResultsInfo';
import ResultsView from './resultsContainer/resultsView/ResultsView';
// import sortOptions from '../../../constants/sortOptions';
import buildSDFileContent from '../../../utils/buildSDFileContent';
import { Result } from '../../../types/Result';
import { ResultMolecule } from '../../../types/ResultMolecule';

type InputProps = {
  result: Result;
  onClickClear: Function;
  show: boolean;
};

function ResultsPanel({ result, onClickClear, show }: InputProps) {
  // const [selectedSortByValue, setSelectedSortByValue] = useState(
  //   sortOptions.rmsd,
  // );

  const handleOnClickDownload = useCallback(() => {
    const fileData = buildSDFileContent(result.molecules);
    const blob = new Blob([fileData], { type: 'text/plain' });
    saveAs(
      blob,
      `${result && result.resultID ? result.resultID : 'results'}.sdf`,
    );
  }, [result]);

  const handleOnChangeSortByValue = useCallback(() => {
    // setSelectedSortByValue(value);
  }, []);

  const sortedMolecules: Array<ResultMolecule> = useMemo(() => {
    // const _sortedMolecules =
    //   result && result.molecules ? result.molecules.slice() : [];
    // _sortedMolecules.sort((molecule1, molecule2) => {
    //   if (selectedSortByValue === sortOptions.rmsd) {
    //     if (molecule1.dataSet.meta.rmsd < molecule2.dataSet.meta.rmsd) {
    //       return -1;
    //     } else if (molecule1.dataSet.meta.rmsd > molecule2.dataSet.meta.rmsd) {
    //       return 1;
    //     }
    //     return 0;
    //   }
    //   // else if (selectedSortByValue === sortOptions.tanimoto) {
    //   //   if (molecule1.meta.tanimoto > molecule2.meta.tanimoto) {
    //   //     return -1;
    //   //   } else if (molecule1.meta.tanimoto < molecule2.meta.tanimoto) {
    //   //     return 1;
    //   //   }
    //   //   return 0;
    //   // }

    //   return 0;
    // });

    // return _sortedMolecules;

    return result && result.molecules ? result.molecules : [];
  }, [result]);

  return (
    <div
      className="results-panel"
      style={
        {
          '--show': show ? 'flex' : 'none',
        } as React.CSSProperties
      }
    >
      <ResultsInfo
        result={result}
        onClickDownload={handleOnClickDownload}
        onChangeSortByValue={handleOnChangeSortByValue}
        onClickClear={onClickClear}
      />
      <ResultsView molecules={sortedMolecules} limit={50} />
    </div>
  );
}

export default ResultsPanel;
