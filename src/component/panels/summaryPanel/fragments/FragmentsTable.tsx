import './FragmentsTable.scss';

import { useData } from '../../../../context/DataContext';
import { memo, useCallback, useMemo } from 'react';
import DataSet from '../../../../types/sherlock/dataSet/DataSet';
import lodashCloneDeep from 'lodash/cloneDeep';
import { useDispatch } from '../../../../context/DispatchContext';
import { EDIT_INCLUDE_FRAGMENT } from '../../../../context/ActionTypes';
import SpectrumCompact from '../../../../types/sherlock/dataSet/SpectrumCompact';
import FragmentTableRow from './FragmentTableRow';
import generateID from '../../../../utils/generateID';

function FragmentsTable() {
  const { resultData } = useData();
  const dispatch = useDispatch();

  const fragments = useMemo(
    () => resultData?.resultRecord.detections.fragments || [],
    [resultData?.resultRecord.detections.fragments],
  );

  const handleOnChange = useCallback(
    (index: number, value: boolean) => {
      const _fragments = lodashCloneDeep(fragments) as DataSet[];
      _fragments[index].attachment.include = value;

      dispatch({
        type: EDIT_INCLUDE_FRAGMENT,
        payload: { fragments: _fragments },
      });
    },
    [dispatch, fragments],
  );

  const rows = useMemo(() => {
    const _rows: JSX.Element[] = [];
    fragments.forEach((fragment: DataSet, i: number) => {
      _rows.push(
        <FragmentTableRow
          index={i}
          fragment={fragment}
          querySpectrum={
            resultData?.resultRecord.querySpectrum as SpectrumCompact
          }
          onChangeHandler={handleOnChange}
          key={`FragmentTableRow_${i}_${generateID()}`}
        />,
      );
    });

    return _rows;
  }, [fragments, handleOnChange, resultData?.resultRecord.querySpectrum]);

  return useMemo(
    () => (
      <div className="fragments-view-div">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Fragment</th>
              <th>Average Deviation (ppm)</th>
              <th>Include</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={4} style={{ border: 'none' }}>
                  <p
                    style={{
                      textAlign: 'center',
                      fontSize: '14px',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    No fragments
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    ),
    [rows],
  );
}

export default memo(FragmentsTable);
