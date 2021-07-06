import 'bootstrap/dist/css/bootstrap.min.css';

import Card from 'react-bootstrap/Card';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { ResultMolecule } from '../../../../../types/ResultMolecule';

type InputProps = {
  molecule: ResultMolecule;
};

function ResultCardText({ molecule }: InputProps) {
  return (
    <Card.Text style={{ fontSize: '14px' }}>
      Formula: {molecule.dataSet.meta.mf}
      <br />
      RMSD:{' '}
      {molecule.dataSet.meta.rmsd
        ? Number(molecule.dataSet.meta.rmsd).toFixed(3)
        : ''}
      <br />
      avg. dev.:{' '}
      {molecule.dataSet.meta.averageDeviation
        ? Number(molecule.dataSet.meta.averageDeviation).toFixed(2)
        : ''}
      {molecule.dataSet.meta.id ? <br /> : null}
      {molecule.dataSet.meta.id ? (
        <a
          href={`http://www.nmrshiftdb.org/molecule/${molecule.dataSet.meta.id}`}
          target="_blank"
          rel="noreferrer"
          title={`Link to molecule ${molecule.dataSet.meta.id} in NMRShiftDB`}
        >
          <FaExternalLinkAlt size="11" />
          {` ${molecule.dataSet.meta.id}`}
        </a>
      ) : (
        ''
      )}
    </Card.Text>
  );
}

export default ResultCardText;
