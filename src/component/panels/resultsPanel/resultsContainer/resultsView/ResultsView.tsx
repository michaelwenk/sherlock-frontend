import './ResultsView.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import CustomPagination from '../../../../elements/CustomPagination';
import ResultCard from '../resultCard/ResultCard';
import { ResultMolecule } from '../../../../../types/ResultMolecule';

type InputProps = {
  molecules: Array<ResultMolecule>;
  limit: number;
};

function ResultsView({ molecules, limit }: InputProps) {
  const [selectedCardDeckIndex, setSelectedCardDeckIndex] = useState(0);

  const handleOnSelectCardIndex = useCallback((index: number) => {
    setSelectedCardDeckIndex(index);
  }, []);

  const cardDeckData = useMemo(() => {
    const _cardDeckData: Array<Array<JSX.Element>> = [];
    let counter = 0;
    let resultCards: Array<JSX.Element> = [];
    for (let i = 0; i < molecules.length; i++) {
      const resultCard = (
        <ResultCard
          key={`resultCard${i}`}
          id={i + 1}
          molecule={molecules[i]}
          styles={{
            minWidth: '12rem',
            maxWidth: '12rem',
            marginLeft: '4px',
            marginBottom: '4px',
            border: 'solid 1px lightgrey',
          }}
        />
      );
      if (counter < limit) {
        counter++;
        resultCards.push(resultCard);
      } else {
        _cardDeckData.push(resultCards);
        resultCards = [resultCard];
        counter = 1;
      }
    }
    if (resultCards.length > 0) {
      _cardDeckData.push(resultCards);
    }

    return _cardDeckData;
  }, [limit, molecules]);

  useEffect(() => {
    setSelectedCardDeckIndex(0);
  }, [cardDeckData]);

  return cardDeckData.length > 0 ? (
    <div className="results-view">
      <div className="results-view-header">
        <CustomPagination
          data={cardDeckData}
          selected={selectedCardDeckIndex}
          onSelect={handleOnSelectCardIndex}
          maxPages={5}
        />
      </div>
      <div className="card-deck-container">
        <Container>
          <CardGroup>{cardDeckData[selectedCardDeckIndex]}</CardGroup>
        </Container>
      </div>
    </div>
  ) : null;
}

export default ResultsView;
