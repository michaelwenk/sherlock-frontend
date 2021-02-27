/** @jsxImportSource @emotion/react */

import { useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import CardDeck from 'react-bootstrap/CardDeck';
import ResultCard from './ResultCard';

function ResultsContainer({ molecules, nCols }) {
  const cardDecks = useMemo(() => {
    const _cardDecks = [];
    const nRows = molecules.length / nCols;
    for (let i = 0; i < nRows; i++) {
      const cards = [];
      for (let j = 0; j < nCols; j++) {
        const index = i + j;
        cards.push(
          <ResultCard
            key={`resultCard${i * nCols + j + 1}`}
            id={i * nCols + j + 1}
            molecule={molecules[index]}
            // styles={{ minWidth: '15rem', minHeight: '15rem' }}
          />,
        );
      }

      _cardDecks.push(<CardDeck key={`cardDeck_${i}`}>{cards}</CardDeck>);
    }

    return _cardDecks;
  }, [molecules, nCols]);

  return <Container className="container-fluid">{cardDecks}</Container>;
}

export default ResultsContainer;
