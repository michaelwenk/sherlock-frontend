import 'bootstrap/dist/css/bootstrap.min.css';

/** @jsxImportSource @emotion/react */
import Card from 'react-bootstrap/Card';
import { QueryTypes } from '../../../queryPanel/constants';

function ResultCardText({ molecule, queryType }) {
  return queryType === QueryTypes.dereplication ? (
    <Card.Text>
      Formula: {molecule.meta.mf}
      <br />
      RMSD: {molecule.meta.rmsd ? Number(molecule.meta.rmsd).toFixed(3) : ''}
      <br />
      Tanimoto: {molecule.meta.tanimoto ? Number(molecule.meta.tanimoto) : ''}
    </Card.Text>
  ) : (
    <Card.Text>Formula: {molecule.meta.mf}</Card.Text>
  );
}

export default ResultCardText;
