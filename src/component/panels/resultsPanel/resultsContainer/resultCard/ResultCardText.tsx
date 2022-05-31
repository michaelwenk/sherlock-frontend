import 'bootstrap/dist/css/bootstrap.min.css';
import './ResultCardText.scss';
import { memo, useMemo } from 'react';
import DataSet from '../../../../../types/sherlock/dataSet/DataSet';

type InputProps = {
  dataSet: DataSet;
};

function ResultCardText({ dataSet }: InputProps) {
  const color = useMemo(
    () => (dataSet.attachment.isCompleteSpectralMatch ? 'inherit' : 'red'),
    [dataSet.attachment.isCompleteSpectralMatch],
  );

  return useMemo(
    () => (
      <div
        className="result-card-text-container"
        style={{ '--value-color': color } as React.CSSProperties}
      >
        <table>
          <tbody>
            <tr>
              <td className="td-name">Formula</td>
              <td>{dataSet.meta.mfOriginal}</td>
            </tr>
            <tr>
              <td className="td-name">Average Deviation</td>
              <td className="td-value">{`${dataSet.attachment.averageDeviation.toFixed(
                2,
              )} ppm`}</td>
            </tr>
            <tr>
              <td className="td-name">RMSD</td>
              <td className="td-value">{`${dataSet.attachment.rmsd.toFixed(
                2,
              )} ppm`}</td>
            </tr>
            <tr>
              <td className="td-name">Matching Signals</td>
              <td className="td-value">
                {`${dataSet.attachment.setAssignmentsCount}/${dataSet.attachment.querySpectrumSignalCount}`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    [
      color,
      dataSet.attachment.averageDeviation,
      dataSet.attachment.querySpectrumSignalCount,
      dataSet.attachment.rmsd,
      dataSet.attachment.setAssignmentsCount,
      dataSet.meta.mfOriginal,
    ],
  );
}

export default memo(ResultCardText);
