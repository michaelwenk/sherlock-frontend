import './FragmentsView.scss';

import { useData } from '../../../../context/DataContext';
import { useCallback, useMemo } from 'react';
import { MolfileSvgRenderer } from 'react-ocl/base';
import generateID from '../../../../utils/generateID';
import OCL, { Molecule } from 'openchemlib';
import CheckBox from '../../../elements/CheckBox';
import DataSet from '../../../../types/sherlock/dataSet/DataSet';
import lodashCloneDeep from 'lodash/cloneDeep';
import { useDispatch } from '../../../../context/DispatchContext';
import { EDIT_INCLUDE_FRAGMENT } from '../../../../context/ActionTypes';

function FragmentsView() {
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
      const mol = Molecule.fromMolfile(fragment.meta.molfile);
      mol.inventCoordinates();
      const molfile = mol.toMolfileV3();
      _rows.push(
        <tr key={generateID()}>
          <td>{i + 1}</td>
          <td style={{ width: '50%' }}>
            <MolfileSvgRenderer
              OCL={OCL}
              molfile={molfile}
              autoCrop={true}
              autoCropMargin={10}
            />
          </td>
          <td style={{ width: '40%' }}>
            <p>{fragment.attachment.averageDeviation.toFixed(2)}</p>
          </td>
          <td style={{ width: '10%' }}>
            <CheckBox
              defaultValue={fragment.attachment.include}
              onChange={(value: boolean) => handleOnChange(i, value)}
            />
          </td>
        </tr>,
      );
    });

    return _rows;
  }, [handleOnChange, fragments]);

  return (
    <div className="fragments-view-div">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Fragment</th>
            <th>Frequency</th>
            <th>include</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default FragmentsView;
