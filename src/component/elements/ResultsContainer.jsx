/** @jsxImportSource @emotion/react */

import Container from 'react-bootstrap/Container';
import CardDeck from 'react-bootstrap/CardDeck';
import ResultCard from './ResultCard';

function ResultsContainer({ molecules, nCols }) {
  return (
    <Container className="container-fluid">
      <CardDeck>
        {molecules.map((molecule, index) => (
          <ResultCard
            key={`resultCard${index}`}
            id={index + 1}
            molecule={molecule}
            styles={{ minWidth: '11rem', maxWidth: '12rem' }}
          />
        ))}
      </CardDeck>
    </Container>
  );
}

export default ResultsContainer;
