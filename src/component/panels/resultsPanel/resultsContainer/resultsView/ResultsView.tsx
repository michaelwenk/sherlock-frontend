import './ResultsView.scss';

import { useCallback, useMemo, useState } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import CustomPagination from '../../../../elements/CustomPagination';
import ResultCard from '../resultCard/ResultCard';
import { ResultMolecule } from '../../../../../types/ResultMolecule';
import SelectBox from '../../../../elements/SelectBox';

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

  const handleOnSelectCardIndex = useCallback((index: number) => {
    setSelectedCardDeckIndex(index);
  }, []);

  const cardDeckData = useMemo(() => {
    const _cardDeckData: Array<Array<ResultMolecule>> = [];
    let counter = 0;
    let resultMolecules: Array<ResultMolecule> = [];
    for (let i = 0; i < molecules.length; i++) {
      if (counter < selectedPageLimit) {
        counter++;
        resultMolecules.push(molecules[i]);
      } else {
        _cardDeckData.push(resultMolecules);
        resultMolecules = [molecules[i]];
        counter = 1;
      }
    }
    if (resultMolecules.length > 0) {
      _cardDeckData.push(resultMolecules);
    }

    return _cardDeckData;
  }, [molecules, selectedPageLimit]);

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
        <div className="page-limit-selection">
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
