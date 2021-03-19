/** @jsxImportSource @emotion/react */

import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import CardDeck from 'react-bootstrap/CardDeck';
import Pagination from 'react-bootstrap/Pagination';
import ResultCard from './ResultCard';
import { useCallback, useMemo, useState } from 'react';
import { Row } from 'react-bootstrap';

function ResultsContainer({ molecules, limit }) {
  const [selectedCardDeckIndex, setSelectedCardDeckIndex] = useState(0);
  const cardDecks = useMemo(() => {
    const _cardDecks = [];
    let counter = 0;
    let resultCards = [];
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
        _cardDecks.push(<CardDeck>{resultCards}</CardDeck>);
        counter = 0;
        resultCards = [resultCard];
      }
    }
    if (resultCards.length > 0) {
      _cardDecks.push(<CardDeck>{resultCards}</CardDeck>);
    }

    return _cardDecks;
  }, [limit, molecules]);

  const handleOnClickFirst = useCallback((e) => {
    e.stopPropagation();
    setSelectedCardDeckIndex(0);
  }, []);

  const handleOnClickPrev = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectedCardDeckIndex(selectedCardDeckIndex - 1);
    },
    [selectedCardDeckIndex],
  );

  const handleOnClickNext = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectedCardDeckIndex(selectedCardDeckIndex + 1);
    },
    [selectedCardDeckIndex],
  );

  const handleOnClickLast = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectedCardDeckIndex(cardDecks.length - 1);
    },
    [cardDecks],
  );

  const paginationItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < cardDecks.length; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === selectedCardDeckIndex}
          activeLabel="A"
          disabled={i === selectedCardDeckIndex}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCardDeckIndex(e.target.text - 1);
          }}
        >
          {i + 1}
        </Pagination.Item>,
      );
    }

    return items;
  }, [cardDecks.length, selectedCardDeckIndex]);

  const pagination = useMemo(
    () => (
      <Pagination>
        <Pagination.First
          onClick={handleOnClickFirst}
          disabled={selectedCardDeckIndex === 0}
        />
        <Pagination.Prev
          onClick={handleOnClickPrev}
          disabled={selectedCardDeckIndex === 0}
        />
        {paginationItems}
        <Pagination.Next
          onClick={handleOnClickNext}
          disabled={selectedCardDeckIndex === cardDecks.length - 1}
        />
        <Pagination.Last
          onClick={handleOnClickLast}
          disabled={selectedCardDeckIndex === cardDecks.length - 1}
        />
      </Pagination>
    ),
    [
      cardDecks.length,
      handleOnClickFirst,
      handleOnClickLast,
      handleOnClickNext,
      handleOnClickPrev,
      paginationItems,
      selectedCardDeckIndex,
    ],
  );

  return (
    <Container fluid>
      {cardDecks.length > 0 && (
        <Row className="justify-content-center">
          {pagination}
          {cardDecks[selectedCardDeckIndex]}
          {pagination}
        </Row>
      )}
    </Container>
  );
}

export default ResultsContainer;
