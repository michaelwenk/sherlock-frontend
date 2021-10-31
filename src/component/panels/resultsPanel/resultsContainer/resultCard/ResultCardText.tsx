import 'bootstrap/dist/css/bootstrap.min.css';

import Card from 'react-bootstrap/Card';
import { ResultMolecule } from '../../../../../types/ResultMolecule';

type InputProps = {
  molecule: ResultMolecule;
};

function ResultCardText({ molecule }: InputProps) {
  const color = molecule.dataSet.meta.isCompleteSpectralMatch ? 'black' : 'red';

  return (
    <Card.Text
      style={{
        fontSize: '14px',
      }}
    >
      <table style={{ width: '100%', textAlign: 'left' }}>
        <tbody>
          <tr>
            <td>Formula</td>
            <td>{molecule.dataSet.meta.mf}</td>
          </tr>
          <tr>
            <td>RMSD</td>
            <td
              style={{
                color: color,
              }}
            >
              {molecule.dataSet.meta.rmsd.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>AvgDev</td>
            <td
              style={{
                color: color,
              }}
            >
              {molecule.dataSet.meta.averageDeviation.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>Tanimoto</td>
            <td
              style={{
                color: color,
              }}
            >
              {molecule.dataSet.meta.tanimoto.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>#Hits</td>
            <td
              style={{
                color: color,
              }}
            >
              {`${molecule.dataSet.meta.setAssignmentsCount}/${molecule.dataSet.meta.querySpectrumSignalCount}`}
            </td>
          </tr>
        </tbody>
      </table>
    </Card.Text>
  );
}

export default ResultCardText;
