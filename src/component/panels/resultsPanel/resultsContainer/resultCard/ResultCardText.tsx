import 'bootstrap/dist/css/bootstrap.min.css';
import './ResultCardText.scss';
import { useMemo } from 'react';
import DataSet from '../../../../../types/sherlock/DataSet';

type InputProps = {
  dataSet: DataSet;
};

function ResultCardText({ dataSet }: InputProps) {
  const color = useMemo(
    () => (dataSet.attachment.isCompleteSpectralMatch ? 'black' : 'red'),
    [dataSet.attachment.isCompleteSpectralMatch],
  );

  return (
    <table
      className="result-card-text"
      style={{ '--value-color': color } as React.CSSProperties}
    >
      <tbody>
        <tr>
          <td>Formula</td>
          <td>{dataSet.meta.mfOriginal}</td>
        </tr>
        <tr>
          <td>RMSD</td>
          <td>
            <span className="value-with-unit">
              <label className="value">
                {dataSet.attachment.rmsd.toFixed(2)}
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
                {dataSet.attachment.averageDeviation.toFixed(2)}
              </label>
              <label className="unit">ppm</label>
            </span>
          </td>
        </tr>
        <tr>
          <td>Tanimoto</td>
          <td className="value-single">
            {dataSet.attachment.tanimoto.toFixed(2)}
          </td>
        </tr>
        <tr>
          <td>Hits</td>
          <td className="value-single">
            {`${dataSet.attachment.setAssignmentsCount}/${dataSet.attachment.querySpectrumSignalCount}`}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ResultCardText;
