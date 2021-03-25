import './ResultsView.css';
import 'bootstrap/dist/css/bootstrap.min.css';

/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import Container from 'react-bootstrap/Container';
import CustomPagination from '../../../../elements/CustomPagination';

function ResultsView({ cardDeckData }) {
  const [selectedCardDeckIndex, setSelectedCardDeckIndex] = useState(0);

  const handleOnSelectCardIndex = useCallback((index) => {
    setSelectedCardDeckIndex(index);
  }, []);

  return (
    <div className="results-view">
      <div className="pagination">
        <CustomPagination
          data={cardDeckData}
          selected={selectedCardDeckIndex}
          onSelect={handleOnSelectCardIndex}
        />
      </div>
      <div className="card-deck-container">
        <Container>
          <CardDeck>{cardDeckData[selectedCardDeckIndex]}</CardDeck>
        </Container>
      </div>
    </div>
  );
}

export default ResultsView;
