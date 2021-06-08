import './ResultsView.scss';

import { useCallback, useMemo, useState } from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import Container from 'react-bootstrap/Container';
import CustomPagination from '../../../../elements/CustomPagination';
import ResultCard from '../resultCard/ResultCard';
import { ResultMolecule } from '../../../../../types/ResultMolecule';

type InputProps = {
  molecules: Array<ResultMolecule>,
  limit: number,
}

function ResultsView({ molecules, limit } : InputProps) {
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
          styles={{ minWidth: '12rem', maxWidth: '12rem' }}
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

  return (
    cardDeckData.length > 0 ? (
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
            <CardDeck>{cardDeckData[selectedCardDeckIndex]}</CardDeck>
          </Container>
        </div>
      </div>
    ) : null
  );
}

export default ResultsView;
