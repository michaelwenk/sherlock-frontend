import './SummaryPanel.css';
import { memo, useEffect, useMemo, useState } from 'react';
import { useData } from '../../../context/DataContext';
import MCD from './mcd/MCD';
import CorrelationTable from './correlationTable/CorrelationTable';
import Overview from './Overview';
import FragmentsTable from './fragmentTable/FragmentsTable';
import { Correlation } from 'nmr-correlation';
import { NMRiumState } from 'nmrium';

function SummaryPanel() {
  const { nmriumState } = useData();

  const [additionalColumnData, setAdditionalColumnData] = useState<
    Correlation[]
  >([]);
  const [
    selectedAdditionalColumnsAtomType,
    setSelectedAdditionalColumnsAtomType,
  ] = useState<string>('H');
  const [showAdditionalColumns, setShowAdditionalColumns] =
    useState<boolean>(false);
  const [showProtonsAsRows, setShowProtonsAsRows] = useState<boolean>(false);
  const [showMCD, setShowMCD] = useState<boolean>(false);
  const [showFragments, setShowFragments] = useState<boolean>(false);

  useEffect(() => {
    function _setShowProtonsAsRows(atomType: string) {
      setShowProtonsAsRows(atomType === 'H-H');
    }

    function _setAdditionalColumnData(
      _nmriumState: Partial<NMRiumState> | undefined,
      _selectedAdditionalColumnsAtomType: string,
    ) {
      setAdditionalColumnData(
        _nmriumState &&
          _nmriumState.data?.correlations &&
          _nmriumState.data.correlations.values
          ? _nmriumState.data.correlations.values
              .filter(
                (correlation) =>
                  correlation.atomType === _selectedAdditionalColumnsAtomType,
              )
              .reverse()
          : [],
      );
    }

    _setShowProtonsAsRows(selectedAdditionalColumnsAtomType);

    const _selectedAdditionalColumnsAtomType =
      selectedAdditionalColumnsAtomType.split('-')[0];
    _setAdditionalColumnData(nmriumState, _selectedAdditionalColumnsAtomType);
  }, [nmriumState, selectedAdditionalColumnsAtomType]);

  const additionalColumnTypes = useMemo(() => {
    return ['H', 'H-H'].concat(
      nmriumState &&
        nmriumState.data?.correlations &&
        nmriumState.data.correlations.values
        ? nmriumState.data.correlations.values
            .map((correlation) => correlation.atomType)
            .filter(
              (atomType, i, array) =>
                atomType !== 'H' && array.indexOf(atomType) === i,
            )
        : [],
    );
  }, [nmriumState]);

  return useMemo(
    () =>
      nmriumState &&
      nmriumState.data?.correlations &&
      nmriumState.data.correlations.values &&
      nmriumState.data.correlations.values.length > 0 ? (
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
              mf={
                nmriumState
                  ? (nmriumState.data?.correlations?.options?.mf ?? '')
                  : ''
              }
              showAdditionalColumns={showAdditionalColumns}
              onChangeShowAdditionalColumns={(value: boolean) =>
                setShowAdditionalColumns(value)
              }
              additionalColumnTypes={additionalColumnTypes}
              selectedAdditionalColumnsAtomType={
                selectedAdditionalColumnsAtomType
              }
              onChangeSelectedAdditionalColumnsAtomType={(
                value: string | number,
              ) => setSelectedAdditionalColumnsAtomType(String(value))}
              showMCD={showMCD}
              onClickButtonShowMCD={() => setShowMCD(!showMCD)}
              showFragments={showFragments}
              onClickButtonShowFragments={() =>
                setShowFragments(!showFragments)
              }
            />
            <CorrelationTable
              additionalColumnData={additionalColumnData}
              showAdditionalColumns={showAdditionalColumns}
              showProtonsAsRows={showProtonsAsRows}
            />
          </div>

          {(showMCD || showFragments) && (
            <div
              style={{
                width: '100%',
                height: '50%',
                display: 'flex',
                flexDirection: 'row',
                borderTop: '1px solid grey',
              }}
            >
              {showMCD && <MCD />}
              {showFragments && <FragmentsTable />}
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
      ),
    [
      additionalColumnData,
      additionalColumnTypes,
      nmriumState,
      selectedAdditionalColumnsAtomType,
      showAdditionalColumns,
      showFragments,
      showMCD,
      showProtonsAsRows,
    ],
  );
}

export default memo(SummaryPanel);
