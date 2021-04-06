import './ResultsContainer.css';

/** @jsxImportSource @emotion/react */
import ResultCard from './resultCard/ResultCard';
import { useCallback, useMemo, useState } from 'react';
import SelectBox from '../../../elements/SelectBox';
import { SortOptions } from '../constants';
import ResultsView from './resultsView/ResultsView';

function ResultsContainer({ molecules, limit }) {
  const [selectedSortByValue, setSelectedSortByValue] = useState(
    SortOptions[0],
  );

  const sortedMolecules = useMemo(() => {
    const _sortedMolecules = molecules.map((mol) => {
      return {
        ...mol,
        meta: {
          ...mol.meta,
          rmsd: Number(mol.meta.rmsd),
          tanimoto: Number(mol.meta.tanimoto),
        },
      };
    });
    _sortedMolecules.sort((molecule1, molecule2) => {
      if (selectedSortByValue === SortOptions[0]) {
        if (molecule1.meta.rmsd < molecule2.meta.rmsd) {
          return -1;
        } else if (molecule1.meta.rmsd > molecule2.meta.rmsd) {
          return 1;
        }
        return 0;
      } else if (selectedSortByValue === SortOptions[1]) {
        if (molecule1.meta.tanimoto > molecule2.meta.tanimoto) {
          return -1;
        } else if (molecule1.meta.tanimoto < molecule2.meta.tanimoto) {
          return 1;
        }
        return 0;
      }

      return 0;
    });
    console.log(_sortedMolecules);

    return _sortedMolecules;
  }, [molecules, selectedSortByValue]);

  const handleOnChangeSortByValue = useCallback((value) => {
    setSelectedSortByValue(value);
  }, []);

  const cardDeckData = useMemo(() => {
    const _cardDeckData = [];
    let counter = 0;
    let resultCards = [];
    for (let i = 0; i < sortedMolecules.length; i++) {
      const resultCard = (
        <ResultCard
          key={`resultCard${i}`}
          id={i + 1}
          molecule={sortedMolecules[i]}
          styles={{ minWidth: '12rem', maxWidth: '12rem' }}
        />
      );
      if (counter < limit) {
        counter++;
        resultCards.push(resultCard);
      } else {
        _cardDeckData.push(resultCards);
        counter = 0;
        resultCards = [resultCard];
      }
    }
    if (resultCards.length > 0) {
      _cardDeckData.push(resultCards);
    }

    return _cardDeckData;
  }, [limit, sortedMolecules]);

  return (
    cardDeckData.length > 0 && (
      <div className="results-container">
        <div className="results-sort-options">
          <SelectBox
            selectionOptions={SortOptions}
            defaultValue={SortOptions[0]}
            onChange={handleOnChangeSortByValue}
          />
        </div>
        <div className="results-view-full">
          <ResultsView cardDeckData={cardDeckData} />
        </div>
      </div>
    )
  );
}

export default ResultsContainer;
