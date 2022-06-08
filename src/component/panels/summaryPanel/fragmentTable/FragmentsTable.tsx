import './FragmentsTable.scss';

import { useData } from '../../../../context/DataContext';
import { memo, useCallback, useMemo, useState } from 'react';
import DataSet from '../../../../types/sherlock/dataSet/DataSet';
import SpectrumCompact from '../../../../types/sherlock/dataSet/SpectrumCompact';
import FragmentTableRow from './FragmentTableRow';
import { ADD_FRAGMENT } from '../../../../context/ActionTypes';
import { useDispatch } from '../../../../context/DispatchContext';
import Button from '../../../elements/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import StructureEditorModal from '../../../elements/modal/StructureEditorModal';
import { useHighlightData } from '../../../highlight';

function FragmentsTable() {
  const { resultData } = useData();
  const dispatch = useDispatch();
  const highlightData = useHighlightData();
  const [showFragmentEditor, setShowFragmentEditor] = useState<boolean>(false);

  const handleOnCloseFragmentEditor = useCallback(
    () => setShowFragmentEditor(false),
    [],
  );

  const handleOnSaveFragmentEditor = useCallback(
    (molfile: string | undefined) => {
      if (molfile) {
        dispatch({
          type: ADD_FRAGMENT,
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
          key={`FragmentTableRow_${i}`}
        />,
      );
    });

    return _rows;
  }, [fragments, resultData?.resultRecord.querySpectrum]);

  const handleOnScroll = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      highlightData.remove();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightData.remove],
  );

  return useMemo(
    () => (
      <div className="fragments-view-div" onScroll={handleOnScroll}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>{`Fragment (${rows.length})`}</th>
              <th>Average Deviation (ppm)</th>
              <th>Include</th>
              <th>
                <Button
                  child={<FontAwesomeIcon icon={faPlus} title="Add fragment" />}
                  onClick={() => {
                    setShowFragmentEditor(!showFragmentEditor);
                  }}
                  style={{ color: 'blue', fontSize: '13px' }}
                />
                {showFragmentEditor && (
                  <StructureEditorModal
                    onClose={handleOnCloseFragmentEditor}
                    onSave={handleOnSaveFragmentEditor}
                  />
                )}
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
    [
      handleOnCloseFragmentEditor,
      handleOnSaveFragmentEditor,
      handleOnScroll,
      rows,
      showFragmentEditor,
    ],
  );
}

export default memo(FragmentsTable);
