import './ResultCard.scss';

import Card from 'react-bootstrap/Card';
import ResultCardText from './ResultCardText';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import PredictionTable from './PredictionTable';
import DataSet from '../../../../../types/sherlock/dataSet/DataSet';
import Button from '../../../../elements/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleDown,
  faAngleDown,
  faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { useData } from '../../../../../context/DataContext';
import SpectrumCompact from '../../../../../types/sherlock/dataSet/SpectrumCompact';
import StructureView from '../../../../elements/StructureView';

type InputProps = {
  id: string | number;
  dataSet: DataSet;
  imageWidth: number;
  imageHeight: number;
  styles?: CSSProperties;
};

const showPredictionTableStates = {
  hide: 'hide',
  default: 'default',
  extended: 'extended',
};

function ResultCard({
  id,
  dataSet,
  imageWidth,
  imageHeight,
  styles = {},
}: InputProps) {
  const { resultData } = useData();

  const [atomHighlights, setAtomHighlights] = useState<number[]>([]);
  const [showPredictionTableState, setShowPredictionTableState] =
    useState<string>(showPredictionTableStates.hide);

  useEffect(
    () => setShowPredictionTableState(showPredictionTableStates.hide),
    [dataSet],
  );

  const querySpectrum = useMemo(
    () => resultData?.resultRecord.querySpectrum as SpectrumCompact,
    [resultData?.resultRecord.querySpectrum],
  );

  const cardBody = useMemo(
    () => (
      <Card.Body className="card-body">
        <div
          className="molfile-svg-renderer"
          style={
            {
              '--imageHeight': `${imageHeight}px`,
              '--imageWidth': `${imageWidth}px`,
            } as React.CSSProperties
          }
        >
          <StructureView
            dataSet={dataSet}
            querySpectrum={querySpectrum}
            onChangeAtomHighlights={(ids: number[]) => setAtomHighlights(ids)}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
          />
        </div>

        <div className="result-card-text-container">
          <ResultCardText dataSet={dataSet} />
        </div>
        {
          <div className="prediction-table-container">
            <Button
              onClick={() => {
                setShowPredictionTableState(
                  showPredictionTableState === showPredictionTableStates.hide
                    ? showPredictionTableStates.default
                    : showPredictionTableState ===
                      showPredictionTableStates.default
                    ? showPredictionTableStates.extended
                    : showPredictionTableStates.hide,
                );
              }}
              child={
                showPredictionTableState === showPredictionTableStates.hide ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : showPredictionTableState ===
                  showPredictionTableStates.default ? (
                  <FontAwesomeIcon icon={faAngleDoubleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleUp} />
                )
              }
            />
            {showPredictionTableState !== showPredictionTableStates.hide && (
              <PredictionTable
                dataSet={dataSet}
                querySpectrum={querySpectrum}
                atomHighlights={atomHighlights}
                isExtended={
                  showPredictionTableState ===
                  showPredictionTableStates.extended
                }
              />
            )}
          </div>
        }
      </Card.Body>
    ),
    [
      atomHighlights,
      dataSet,
      imageHeight,
      imageWidth,
      querySpectrum,
      showPredictionTableState,
    ],
  );

  const cardLink = useMemo(
    () =>
      dataSet.meta.id ? (
        <Card.Link
          href={
            dataSet.meta.source === 'nmrshiftdb'
              ? `http://www.nmrshiftdb.org/molecule/${dataSet.meta.id}`
              : dataSet.meta.source === 'coconut'
              ? `https://coconut.naturalproducts.net/compound/coconut_id/${dataSet.meta.id}`
              : '?'
          }
          target="_blank"
          rel="noreferrer"
          title={`Link to molecule ${dataSet.meta.id} in ${
            dataSet.meta.source === 'nmrshiftdb'
              ? 'NMRShiftDB'
              : dataSet.meta.source === 'coconut'
              ? 'COCONUT'
              : '?'
          }`}
        >
          {dataSet.meta.id}
        </Card.Link>
      ) : null,
    [dataSet.meta.id, dataSet.meta.source],
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
