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
      Formula: {molecule.meta.mf}
      <br />
      RMSD: {molecule.meta.rmsd ? Number(molecule.meta.rmsd).toFixed(3) : ''}
      {/* <br /> */}
      {/* Tanimoto:{' '}
      {molecule.meta.tanimoto ? Number(molecule.meta.tanimoto).toFixed(5) : ''} */}
      {molecule.meta.id ? <br /> : null}
      {molecule.meta.id ? (
        <a
          href={`http://www.nmrshiftdb.org/molecule/${molecule.meta.id}`}
          target="_blank"
          rel="noreferrer"
          title={`Link to molecule ${molecule.meta.id} in NMRShiftDB`}
        >
          <FaExternalLinkAlt size="11" />
          {` ${molecule.meta.id}`}
        </a>
      ) : (
        ''
      )}
    </Card.Text>
  );
}

export default ResultCardText;
