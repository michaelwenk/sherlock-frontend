import 'bootstrap/dist/css/bootstrap.min.css';
import './ResultCardText.scss';
import { useMemo } from 'react';

import ResultMolecule from '../../../../../types/ResultMolecule';

type InputProps = {
  molecule: ResultMolecule;
};

function ResultCardText({ molecule }: InputProps) {
  const color = useMemo(
    () => (molecule.dataSet.meta.isCompleteSpectralMatch ? 'black' : 'red'),
    [molecule.dataSet.meta.isCompleteSpectralMatch],
  );

  return (
    <table
      className="result-card-text"
      style={{ '--value-color': color } as React.CSSProperties}
    >
      <tbody>
        <tr>
          <td>Formula</td>
          <td>{molecule.dataSet.meta.mfOriginal}</td>
        </tr>
        <tr>
          <td>RMSD</td>
          <td>
            <span className="value-with-unit">
              <label className="value">
                {molecule.dataSet.meta.rmsd.toFixed(2)}
              </label>
              <label className="unit">ppm</label>
            </span>
          </td>
        </tr>
        <tr>
          <td>AvgDev</td>
          <td>
            <span className="value-with-unit">
              <label className="value">
                {molecule.dataSet.meta.averageDeviation.toFixed(2)}
              </label>
              <label className="unit">ppm</label>
            </span>
          </td>
        </tr>
        <tr>
          <td>Tanimoto</td>
          <td className="value-single">
            {molecule.dataSet.meta.tanimoto.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td>#Hits</td>
          <td className="value-single">
            {`${molecule.dataSet.meta.setAssignmentsCount}/${molecule.dataSet.meta.querySpectrumSignalCount}`}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ResultCardText;
