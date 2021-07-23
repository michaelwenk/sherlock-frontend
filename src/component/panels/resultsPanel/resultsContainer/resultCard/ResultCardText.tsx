import 'bootstrap/dist/css/bootstrap.min.css';

import Card from 'react-bootstrap/Card';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { ResultMolecule } from '../../../../../types/ResultMolecule';

type InputProps = {
  molecule: ResultMolecule;
};

function ResultCardText({ molecule }: InputProps) {
  const color = molecule.dataSet.meta.isCompleteSpectralMatchWithEquivalences
    ? 'black'
    : molecule.dataSet.meta.isCompleteSpectralMatch
    ? 'orange'
    : 'red';

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
              {molecule.dataSet.meta.isCompleteSpectralMatchWithEquivalences
                ? molecule.dataSet.meta.rmsd.toFixed(2)
                : molecule.dataSet.meta.isCompleteSpectralMatch
                ? molecule.dataSet.meta.rmsd.toFixed(2)
                : molecule.dataSet.meta.rmsdIncomplete.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>AvgDev</td>
            <td
              style={{
                color: color,
              }}
            >
              {molecule.dataSet.meta.isCompleteSpectralMatchWithEquivalences
                ? molecule.dataSet.meta.averageDeviation.toFixed(2)
                : molecule.dataSet.meta.isCompleteSpectralMatch
                ? molecule.dataSet.meta.averageDeviation.toFixed(2)
                : molecule.dataSet.meta.averageDeviationIncomplete.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>#Hits</td>
            <td
              style={{
                color: color,
              }}
            >
              {`${molecule.dataSet.meta.setAssignmentsCountWithEquivalences}/${molecule.dataSet.meta.querySpectrumSignalCountWithEquivalences}`}
            </td>
          </tr>
          {molecule.dataSet.meta.id ? (
            <tr>
              <td colSpan={2}>
                {
                  <a
                    href={`http://www.nmrshiftdb.org/molecule/${molecule.dataSet.meta.id}`}
                    target="_blank"
                    rel="noreferrer"
                    title={`Link to molecule ${molecule.dataSet.meta.id} in NMRShiftDB`}
                  >
                    <FaExternalLinkAlt size="11" />
                    {` ${molecule.dataSet.meta.id}`}
                  </a>
                }
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </Card.Text>
  );
}

export default ResultCardText;
