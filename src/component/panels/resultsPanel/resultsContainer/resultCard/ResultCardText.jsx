import 'bootstrap/dist/css/bootstrap.min.css';

/** @jsxImportSource @emotion/react */
import Card from 'react-bootstrap/Card';

function ResultCardText({ molecule }) {
  return (
    <Card.Text>
      Formula: {molecule.meta.mf}
      <br />
      RMSD: {molecule.meta.rmsd ? Number(molecule.meta.rmsd).toFixed(3) : ''}
      <br />
      Tanimoto: {molecule.meta.tanimoto ? Number(molecule.meta.tanimoto) : ''}
      {molecule.meta.id ? <br /> : null}
      {molecule.meta.id ? 'NMRShiftDB ID: ' + molecule.meta.id : ''}
    </Card.Text>
  );
}

export default ResultCardText;
