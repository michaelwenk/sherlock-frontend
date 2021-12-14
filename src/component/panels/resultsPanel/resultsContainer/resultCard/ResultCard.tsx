import 'bootstrap/dist/css/bootstrap.min.css';

import Card from 'react-bootstrap/Card';
import OCLnmr from 'react-ocl-nmr';
import OCL from 'openchemlib/full';
import ResultCardText from './ResultCardText';
import { ResultMolecule } from '../../../../../types/ResultMolecule';
import { useMemo } from 'react';

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
  const cardBody = useMemo(
    () => (
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
    ),
    [id, imageHeight, imageWidth, molecule],
  );

  const cardLink = useMemo(
    () => (
      <Card.Link
        style={{
          color: 'blue',
          fontSize: 14,
          textAlign: 'center',
          marginBottom: '5px',
        }}
      >
        {molecule.dataSet.meta.id ? (
          <a
            href={
              molecule.dataSet.meta.source === 'nmrshiftdb'
                ? `http://www.nmrshiftdb.org/molecule/${molecule.dataSet.meta.id}`
                : molecule.dataSet.meta.source === 'coconut'
                ? `https://coconut.naturalproducts.net/compound/coconut_id/${molecule.dataSet.meta.id}`
                : '?'
            }
            target="_blank"
            rel="noreferrer"
            title={`Link to molecule ${molecule.dataSet.meta.id} in ${
              molecule.dataSet.meta.source === 'nmrshiftdb'
                ? 'NMRShiftDB'
                : molecule.dataSet.meta.source === 'coconut'
                ? 'COCONUT'
                : '?'
            }`}
          >
            <text>{molecule.dataSet.meta.id}</text>
          </a>
        ) : null}
      </Card.Link>
    ),
    [molecule.dataSet.meta.id, molecule.dataSet.meta.source],
  );

  return (
    <Card style={styles}>
      <Card.Header>{`#${id}`}</Card.Header>
      {cardBody}
      {cardLink}
    </Card>
  );
}

export default ResultCard;
