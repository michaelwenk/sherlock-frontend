import './FragmentsTable.scss';

import { useData } from '../../../../context/DataContext';
import { memo, useCallback, useMemo, useState } from 'react';
import DataSet from '../../../../types/sherlock/dataSet/DataSet';
import SpectrumCompact from '../../../../types/sherlock/dataSet/SpectrumCompact';
import FragmentTableRow from './FragmentTableRow';
import generateID from '../../../../utils/generateID';
import { ADD_NEW_FRAGMENT } from '../../../../context/ActionTypes';
import { useDispatch } from '../../../../context/DispatchContext';
import Button from '../../../elements/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import StructureEditorModal from '../../../elements/modal/StructureEditorModal';

function FragmentsTable() {
  const { resultData } = useData();
  const dispatch = useDispatch();
  const [showFragmentEditor, setShowFragmentEditor] = useState<boolean>(false);

  const handleOnSaveNewFragment = useCallback(
    (molfile: string | undefined) => {
      if (molfile) {
        dispatch({
          type: ADD_NEW_FRAGMENT,
          payload: { molfile },
        });
      }
    },
    [dispatch],
  );

  const fragments: DataSet[] = useMemo(
    () => resultData?.resultRecord.detections.fragments || [],
    [resultData?.resultRecord.detections.fragments],
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
          key={`FragmentTableRow_${i}_${generateID()}`}
        />,
      );
    });

    return _rows;
  }, [fragments, resultData?.resultRecord.querySpectrum]);

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
              <th>
                <Button
                  child={<FontAwesomeIcon icon={faPlus} title="Add fragment" />}
                  onClick={() => {
                    setShowFragmentEditor(!showFragmentEditor);
                  }}
                />
                <StructureEditorModal
                  show={showFragmentEditor}
                  setShow={setShowFragmentEditor}
                  onSave={handleOnSaveNewFragment}
                />
              </th>
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
    [handleOnSaveNewFragment, rows, showFragmentEditor],
  );
}

export default memo(FragmentsTable);
