import './ResultsView.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import CustomPagination from '../../../../elements/CustomPagination';
import ResultCard from '../resultCard/ResultCard';
import { ResultMolecule } from '../../../../../types/ResultMolecule';

type InputProps = {
  molecules: Array<ResultMolecule>;
  pageLimit: number;
  maxPages: number;
};

function ResultsView({ molecules, pageLimit, maxPages }: InputProps) {
  const [selectedCardDeckIndex, setSelectedCardDeckIndex] = useState(0);

  const handleOnSelectCardIndex = useCallback((index: number) => {
    setSelectedCardDeckIndex(index);
  }, []);

  const cardDeckData = useMemo(() => {
    const _cardDeckData: Array<Array<ResultMolecule>> = [];
    let counter = 0;
    let resultMolecules: Array<ResultMolecule> = [];
    for (let i = 0; i < molecules.length; i++) {
      if (counter < pageLimit) {
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
  }, [pageLimit, molecules]);

  const cardDecks = useMemo(
    () =>
      cardDeckData[selectedCardDeckIndex].map((mol, i) => (
        <ResultCard
          key={`resultCard${i}`}
          id={selectedCardDeckIndex * pageLimit + i + 1}
          molecule={mol}
          styles={{
            minWidth: '12rem',
            maxWidth: '12rem',
            marginLeft: '4px',
            marginBottom: '4px',
            border: 'solid 1px lightgrey',
          }}
        />
      )),
    [cardDeckData, pageLimit, selectedCardDeckIndex],
  );

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
          maxPages={maxPages}
        />
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
