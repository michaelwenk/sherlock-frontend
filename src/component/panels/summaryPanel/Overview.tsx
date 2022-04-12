import './Overview.scss';

import { FaAngleDown, FaAngleRight, FaProjectDiagram } from 'react-icons/fa';
import Button from '../../elements/Button';
import SelectBox from '../../elements/SelectBox';
import { MF } from 'react-mf';
import { CSSProperties } from 'react';

interface InputProps {
  mf: string;
  additionalColumnTypes: string[];
  showAdditionalColumns: boolean;
  onChangeShowAdditionalColumns: Function;
  selectedAdditionalColumnsAtomType: string;
  onChangeSelectedAdditionalColumnsAtomType: Function;
  showMCD: boolean;
  onClickButtonShowMCD: Function;
}

function Overview({
  mf,
  additionalColumnTypes,
  showAdditionalColumns,
  onChangeShowAdditionalColumns,
  selectedAdditionalColumnsAtomType,
  onChangeSelectedAdditionalColumnsAtomType,
  showMCD,
  onClickButtonShowMCD,
}: InputProps) {
  return (
    <div className="overview-container">
      <div className="show-mcd-button-container">
        <Button
          style={
            {
              '--show-mcd-button-color': showMCD ? 'blue' : 'black',
            } as CSSProperties
          }
          child={
            <FaProjectDiagram
              title={showMCD ? 'Hide MCD' : 'Show MCD (beta)'}
            />
          }
          onClick={onClickButtonShowMCD}
        />
      </div>
      <p className="formula">
        <MF mf={mf} />
      </p>
      <div className="table-view-selection">
        {showAdditionalColumns && (
          <span>
            <label>View:</label>
            <SelectBox
              onChange={(selection: string) => {
                onChangeSelectedAdditionalColumnsAtomType(selection);
              }}
              values={additionalColumnTypes}
              defaultValue={selectedAdditionalColumnsAtomType}
            />
          </span>
        )}
        <Button
          onClick={() => onChangeShowAdditionalColumns(!showAdditionalColumns)}
          child={
            showAdditionalColumns ? (
              <FaAngleDown title="Hide right table part" />
            ) : (
              <FaAngleRight title="Show right table part" />
            )
          }
        />
      </div>
    </div>
  );
}

export default Overview;
