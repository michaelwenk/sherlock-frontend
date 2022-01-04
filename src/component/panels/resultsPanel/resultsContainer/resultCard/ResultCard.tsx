import 'bootstrap/dist/css/bootstrap.min.css';

import Card from 'react-bootstrap/Card';
import OCL from 'openchemlib/full';
import ResultCardText from './ResultCardText';
import ResultMolecule from '../../../../../types/ResultMolecule';
import { CSSProperties, useMemo } from 'react';
import { SmilesSvgRenderer } from 'react-ocl/base';

type InputProps = {
  id: string | number;
  molecule: ResultMolecule;
  imageWidth: number;
  imageHeight: number;
  styles?: CSSProperties;
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
        <SmilesSvgRenderer
          OCL={OCL}
          id={`molSVG${id}`}
          smiles={molecule.dataSet.meta.smiles}
          width={imageWidth}
          height={imageHeight}
        />
        <ResultCardText molecule={molecule} />
      </Card.Body>
    ),
    [id, imageHeight, imageWidth, molecule],
  );

  const cardLink = useMemo(
    () =>
      molecule.dataSet.meta.id ? (
        <Card.Link
          style={{
            color: 'blue',
            fontSize: 14,
            textAlign: 'center',
            marginBottom: '5px',
          }}
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
          {molecule.dataSet.meta.id}
        </Card.Link>
      ) : null,
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
