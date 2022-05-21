import './SummaryPanel.scss';
import { memo, useEffect, useMemo, useState } from 'react';
import { useData } from '../../../context/DataContext';
import MCD from './mcd/MCD';
import CorrelationTable from './correlationTable/CorrelationTable';
import Overview from './Overview';
import FragmentsView from './fragments/FragmentsView';

function SummaryPanel() {
  const { nmriumData } = useData();

  const [additionalColumnData, setAdditionalColumnData] = useState([]);
  const [
    selectedAdditionalColumnsAtomType,
    setSelectedAdditionalColumnsAtomType,
  ] = useState<string>('H');
  const [showAdditionalColumns, setShowAdditionalColumns] =
    useState<boolean>(false);
  const [showProtonsAsRows, setShowProtonsAsRows] = useState<boolean>(false);
  const [showMCD, setShowMCD] = useState<boolean>(false);

  useEffect(() => {
    const _selectedAdditionalColumnsAtomType =
      selectedAdditionalColumnsAtomType.split('-')[0];

    setShowProtonsAsRows(selectedAdditionalColumnsAtomType === 'H-H');

    setAdditionalColumnData(
      nmriumData && nmriumData.correlations
        ? nmriumData.correlations.values
            .filter(
              (correlation) =>
                correlation.atomType === _selectedAdditionalColumnsAtomType,
            )
            .reverse()
        : [],
    );
  }, [nmriumData, selectedAdditionalColumnsAtomType]);

  const additionalColumnTypes = useMemo(() => {
    return ['H', 'H-H'].concat(
      nmriumData && nmriumData.correlations
        ? nmriumData.correlations.values
            .map((correlation) => correlation.atomType)
            .filter(
              (atomType, i, array) =>
                atomType !== 'H' && array.indexOf(atomType) === i,
            )
        : [],
    );
  }, [nmriumData]);

  return nmriumData?.correlations?.values &&
    nmriumData.correlations.values.length > 0 ? (
    <div className="summary-panel">
      <div
        className="overview-table-container"
        style={
          {
            '--overview-table-container-height': showMCD ? '50%' : '100%',
          } as React.CSSProperties
        }
      >
        <Overview
          mf={nmriumData ? nmriumData.correlations.options.mf : ''}
          showAdditionalColumns={showAdditionalColumns}
          onChangeShowAdditionalColumns={(value: boolean) =>
            setShowAdditionalColumns(value)
          }
          additionalColumnTypes={additionalColumnTypes}
          selectedAdditionalColumnsAtomType={selectedAdditionalColumnsAtomType}
          onChangeSelectedAdditionalColumnsAtomType={(value: string) =>
            setSelectedAdditionalColumnsAtomType(value)
          }
          showMCD={showMCD}
          onClickButtonShowMCD={() => setShowMCD(!showMCD)}
        />
        <CorrelationTable
          additionalColumnData={additionalColumnData}
          showAdditionalColumns={showAdditionalColumns}
          showProtonsAsRows={showProtonsAsRows}
        />
      </div>
      {showMCD && (
        <div
          style={{
            width: '100%',
            height: '50%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <MCD />
          <FragmentsView />
        </div>
      )}
    </div>
  ) : (
    <p
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontStyle: 'italic',
      }}
    >
      No data
    </p>
  );
}

export default memo(SummaryPanel);
