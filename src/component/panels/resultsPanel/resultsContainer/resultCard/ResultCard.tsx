import 'bootstrap/dist/css/bootstrap.min.css';

import Card from 'react-bootstrap/Card';
import OCLnmr from 'react-ocl-nmr';
import OCL from 'openchemlib/full';
import ResultCardText from './ResultCardText';
import { ResultMolecule } from '../../../../../App';

type InputProps = {
  id: string | number,
  molecule: ResultMolecule,
  styles: any,
}

function ResultCard({ id, molecule, styles } : InputProps) {
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
        <ResultCardText molecule={molecule} />
      </Card.Body>
    </Card>
  );
}

export default ResultCard;
