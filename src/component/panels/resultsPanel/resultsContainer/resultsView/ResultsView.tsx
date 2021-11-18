import './ResultsView.scss';

import { useCallback, useMemo, useState } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import CustomPagination from '../../../../elements/CustomPagination';
import ResultCard from '../resultCard/ResultCard';
import { ResultMolecule } from '../../../../../types/ResultMolecule';
import SelectBox from '../../../../elements/SelectBox';
import sortOptions from '../../../../../constants/sortOptions';
import capitalize from '../../../../../utils/capitalize';

type InputProps = {
  molecules: Array<ResultMolecule>;
  maxPages: number;
  pageLimits: number[];
};

function ResultsView({ molecules, maxPages, pageLimits }: InputProps) {
  const [selectedCardDeckIndex, setSelectedCardDeckIndex] = useState<number>(0);
  const [selectedPageLimit, setSelectedPageLimit] = useState<number>(
    pageLimits[1],
  );
  const [sortByValue, setSortByValue] = useState<string>(
    sortOptions.averageDeviation,
  );

  const handleOnSelectCardIndex = useCallback((index: number) => {
    setSelectedCardDeckIndex(index);
  }, []);

  const sortedMolecules = useMemo(() => {
    function sort(mol1: ResultMolecule, mol2: ResultMolecule) {
      if (sortByValue === sortOptions.tanimoto) {
        return mol1.dataSet.meta[sortByValue] >= mol2.dataSet.meta[sortByValue]
          ? -1
          : 1;
      } else {
        return mol1.dataSet.meta[sortByValue] <= mol2.dataSet.meta[sortByValue]
          ? -1
          : 1;
      }
    }

    const _sortedMolecules = molecules.slice();
    _sortedMolecules.sort(sort);

    return _sortedMolecules;
  }, [molecules, sortByValue]);

  const cardDeckData = useMemo(() => {
    const _cardDeckData: ResultMolecule[][] = [];
    let counter = 0;
    let resultMolecules: ResultMolecule[] = [];

    for (let i = 0; i < sortedMolecules.length; i++) {
      if (counter < selectedPageLimit) {
        counter++;
        resultMolecules.push(sortedMolecules[i]);
      } else {
        _cardDeckData.push(resultMolecules);
        resultMolecules = [sortedMolecules[i]];
        counter = 1;
      }
    }
    if (resultMolecules.length > 0) {
      _cardDeckData.push(resultMolecules);
    }

    return _cardDeckData;
  }, [selectedPageLimit, sortedMolecules]);

  const cardDecks = useMemo(() => {
    let cardDeckIndex = selectedCardDeckIndex;
    if (cardDeckIndex >= cardDeckData.length) {
      cardDeckIndex = 0;
      setSelectedCardDeckIndex(cardDeckIndex);
    }

    return cardDeckData.length > 0
      ? cardDeckData[cardDeckIndex].map((mol, i) => (
          <ResultCard
            key={`resultCard${i}`}
            id={cardDeckIndex * selectedPageLimit + i + 1}
            molecule={mol}
            styles={{
              minWidth: '12rem',
              maxWidth: '12rem',
              marginLeft: '4px',
              marginBottom: '4px',
              border: 'solid 1px lightgrey',
            }}
          />
        ))
      : [];
  }, [cardDeckData, selectedCardDeckIndex, selectedPageLimit]);

  return cardDeckData.length > 0 ? (
    <div className="results-view">
      <div className="results-view-header">
        <div className="pagination">
          <CustomPagination
            data={cardDeckData}
            selected={selectedCardDeckIndex}
            onSelect={handleOnSelectCardIndex}
            maxPages={maxPages}
          />
        </div>
        <div className="sort-by-and-page-limit-selection">
          <SelectBox
            values={Object.keys(sortOptions)}
            defaultValue={sortOptions.averageDeviation}
            onChange={(value: string) => setSortByValue(value)}
          />
          <SelectBox
            values={pageLimits}
            defaultValue={selectedPageLimit}
            onChange={(value: number) => setSelectedPageLimit(value)}
          />
        </div>
      </div>
      <div className="card-deck-container">
        <Container>
          <CardGroup>{cardDecks}</CardGroup>
        </Container>
      </div>
    </div>
  ) : null;
}

export default ResultsView;
