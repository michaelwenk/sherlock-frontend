import './FunctionalGroups.scss';

import { useData } from '../../../../context/DataContext';
import { useCallback, useMemo } from 'react';
import { MolfileSvgRenderer } from 'react-ocl/base';
import generateID from '../../../../utils/generateID';
import OCL, { Molecule } from 'openchemlib';
import CheckBox from '../../../elements/CheckBox';
import DataSet from '../../../../types/sherlock/dataSet/DataSet';
import lodashCloneDeep from 'lodash/cloneDeep';
import { useDispatch } from '../../../../context/DispatchContext';
import { EDIT_INCLUDE_FUNCTIONAL_GROUP } from '../../../../context/ActionTypes';

function FunctionalGroupsView() {
  const { resultData } = useData();
  const dispatch = useDispatch();

  const functionalGroups = useMemo(
    () => resultData?.resultRecord.detections.functionalGroups,
    [resultData?.resultRecord.detections.functionalGroups],
  );

  const handleOnChange = useCallback(
    (index: number, value: boolean) => {
      const _functionalGroups = lodashCloneDeep(functionalGroups) as DataSet[];
      _functionalGroups[index].attachment.include = value;

      dispatch({
        type: EDIT_INCLUDE_FUNCTIONAL_GROUP,
        payload: { functionalGroups: _functionalGroups },
      });
    },
    [dispatch, functionalGroups],
  );

  const rows = useMemo(() => {
    const _rows: JSX.Element[] = [];
    if (functionalGroups) {
      functionalGroups.forEach((group: DataSet, i: number) => {
        const mol = Molecule.fromMolfile(group.meta.molfile);
        mol.inventCoordinates();
        const molfile = mol.toMolfileV3();
        _rows.push(
          <tr id={generateID()}>
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
              <p>{`${group.attachment.count} (${(
                (group.attachment.count / group.attachment.total) *
                100
              ).toFixed(1)}%)`}</p>
            </td>
            <td style={{ width: '10%' }}>
              <CheckBox
                defaultValue={group.attachment.include}
                onChange={(value: boolean) => handleOnChange(i, value)}
              />
            </td>
          </tr>,
        );
      });
    }

    return _rows;
  }, [functionalGroups, handleOnChange]);

  return (
    <div className="functional-groups-view-div">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Functional Group</th>
            <th>Frequency</th>
            <th>include</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default FunctionalGroupsView;
