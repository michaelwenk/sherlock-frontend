import 'bootstrap/dist/css/bootstrap.min.css';

/** @jsxImportSource @emotion/react */
import Card from 'react-bootstrap/Card';
import OCLnmr from 'react-ocl-nmr';
import OCL from 'openchemlib/full';
import ResultCardText from './ResultCardText';

function ResultCard({ id, molecule, styles, queryType }) {
  return (
    <Card style={styles}>
      <Card.Header>{`#${id}`}</Card.Header>
      <Card.Body>
        <OCLnmr
          OCL={OCL}
          id={`molSVG${id}`}
          width={150}
          height={150}
          molfile={molecule.molfile}
          setSelectedAtom={() => {}}
          atomHighlightColor={'red'}
          atomHighlightOpacity={0.35}
          highlights={[]}
          setHoverAtom={() => {}}
          setMolfile={() => {}}
        />
        {/* <Card.Title>
          {molecule.meta.rmsd ? Number(molecule.meta.rmsd).toFixed(3) : ''}
        </Card.Title> */}
        <ResultCardText molecule={molecule} queryType={queryType} />
      </Card.Body>
    </Card>
  );
}

export default ResultCard;
