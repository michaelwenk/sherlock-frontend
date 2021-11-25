import 'bootstrap/dist/css/bootstrap.min.css';

import Card from 'react-bootstrap/Card';
import OCLnmr from 'react-ocl-nmr';
import OCL from 'openchemlib/full';
import ResultCardText from './ResultCardText';
import { ResultMolecule } from '../../../../../types/ResultMolecule';
import { FaExternalLinkAlt } from 'react-icons/fa';

type InputProps = {
  id: string | number;
  molecule: ResultMolecule;
  imageWidth: number;
  imageHeight: number;
  styles?: any;
};

function ResultCard({
  id,
  molecule,
  imageWidth,
  imageHeight,
  styles = {},
}: InputProps) {
  return (
    <Card style={styles}>
      <Card.Header>{`#${id}`}</Card.Header>
      <Card.Body>
        <OCLnmr
          OCL={OCL}
          id={`molSVG${id}`}
          width={imageWidth}
          height={imageHeight}
          molfile={molecule.molfile}
          setSelectedAtom={() => {}}
          atomHighlightColor={'red'}
          atomHighlightOpacity={0.35}
          highlights={[]}
          setHoverAtom={() => {}}
          setMolfile={() => {}}
        />
        <ResultCardText molecule={molecule} />
      </Card.Body>
      {molecule.dataSet.meta.id ? (
        <Card.Link>
          {molecule.dataSet.meta.source === 'nmrshiftdb' ? (
            <a
              href={`http://www.nmrshiftdb.org/molecule/${molecule.dataSet.meta.id}`}
              target="_blank"
              rel="noreferrer"
              title={`Link to molecule ${molecule.dataSet.meta.id} in NMRShiftDB`}
            >
              <FaExternalLinkAlt size="11" />
              {` ${molecule.dataSet.meta.id}`}
            </a>
          ) : molecule.dataSet.meta.source === 'coconut' ? (
            <a
              href={`https://coconut.naturalproducts.net/compound/coconut_id/${molecule.dataSet.meta.id}`}
              target="_blank"
              rel="noreferrer"
              title={`Link to molecule ${molecule.dataSet.meta.id} in COCONUT`}
            >
              <FaExternalLinkAlt size="11" />
              {` ${molecule.dataSet.meta.id}`}
            </a>
          ) : null}
        </Card.Link>
      ) : null}
    </Card>
  );
}

export default ResultCard;
