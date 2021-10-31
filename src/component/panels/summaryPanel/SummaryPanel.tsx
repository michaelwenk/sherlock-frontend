import { memo, useCallback, useEffect, useState } from 'react';
import { useData } from '../../../context/DataContext';
import CorrelationTable from './correlationTable/CorrelationTable';
import Overview from './Overview';

function SummaryPanel() {
  const { nmriumData } = useData();

  const [additionalColumnData, setAdditionalColumnData] = useState([]);
  const [showAdditionalColumns, setShowAdditionalColumns] =
    useState<boolean>(false);

  useEffect(() => {
    setAdditionalColumnData(
      nmriumData && nmriumData.correlations
        ? nmriumData.correlations.values
            .filter((correlation) => correlation.atomType === 'H')
            .reverse()
        : [],
    );
  }, [nmriumData]);

  const changeHybridizationSaveHandler = useCallback(() => {
    // dispatch({
    //   type: SET_CORRELATION,
    //   payload: {
    //     id: correlation.id,
    //     correlation: {
    //       ...correlation,
    //       hybridization: value,
    //       edited: { ...correlation.edited, hybridization: true },
    //     },
    //     options: {
    //       skipDataUpdate: true,
    //     },
    //   },
    // });
  }, []);

  // const setCorrelationsHandler = useCallback(
  //   (correlations: Types.Values, options?: Types.Options) => {
  //     dispatch({
  //       type: SET_CORRELATIONS,
  //       payload: {
  //         correlations,
  //         options,
  //       },
  //     });
  //   },
  //   [dispatch],
  // );

  return (
    <div className="summary-panel">
      <Overview
        mf={nmriumData ? nmriumData.correlations.options.mf : ''}
        showAdditionalColumns={showAdditionalColumns}
        onChangeShowAdditionalColumns={(value: boolean) =>
          setShowAdditionalColumns(value)
        }
      />
      <CorrelationTable
        additionalColumnData={additionalColumnData}
        changeHybridizationSaveHandler={changeHybridizationSaveHandler}
        showAdditionalColumns={showAdditionalColumns}
      />
    </div>
  );
}

export default memo(SummaryPanel);
