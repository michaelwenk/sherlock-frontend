import './ResultsPanel.scss';

import { useCallback, useMemo } from 'react';
import { saveAs } from 'file-saver';
import ResultsInfo from './resultsInfo/ResultsInfo';
import ResultsView from './resultsContainer/resultsView/ResultsView';
import buildSDFileContent from '../../../utils/buildSDFileContent';
import { Result } from '../../../types/Result';
import { useData } from '../../../context/DataContext';
import buildMolecules from '../../../utils/buildMolecules';

type InputProps = {
  result?: Result;
  onClickClear: Function;
  show: boolean;
};

function ResultsPanel({ onClickClear, show }: InputProps) {
  const { resultData } = useData();

  const molecules = useMemo(() => {
    return resultData && resultData.resultRecord
      ? buildMolecules(resultData.resultRecord)
      : [];
  }, [resultData]);

  const handleOnClickDownload = useCallback(() => {
    if (molecules) {
      const fileData = buildSDFileContent({ resultMolecules: molecules });
      const blob = new Blob([fileData], { type: 'text/plain' });
      saveAs(
        blob,
        `${
          resultData
            ? resultData.resultRecord?.name
              ? resultData.resultRecord.name
              : 'results'
            : 'results'
        }.sdf`,
      );
    }
  }, [molecules, resultData]);

  return resultData ? (
    <div
      className="results-panel"
      style={
        {
          '--show': show ? 'flex' : 'none',
        } as React.CSSProperties
      }
    >
      <ResultsInfo
        onClickDownload={handleOnClickDownload}
        onClickClear={onClickClear}
        onChangeSortByValue={() => {}}
      />
      <ResultsView molecules={molecules} limit={50} />
    </div>
  ) : null;
}

export default ResultsPanel;
