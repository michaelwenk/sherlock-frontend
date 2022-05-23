import './Overview.scss';

import Button from '../../elements/Button';
import SelectBox from '../../elements/SelectBox';
import { MF } from 'react-mf';
import { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleRight,
  faCircleNodes,
  faProjectDiagram,
} from '@fortawesome/free-solid-svg-icons';

interface InputProps {
  mf: string;
  additionalColumnTypes: string[];
  showAdditionalColumns: boolean;
  onChangeShowAdditionalColumns: Function;
  onClickButtonShowFragments: Function;
  selectedAdditionalColumnsAtomType: string;
  onChangeSelectedAdditionalColumnsAtomType: Function;
  showMCD: boolean;
  showFragments: boolean;
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
  showFragments,
  onClickButtonShowMCD,
  onClickButtonShowFragments,
}: InputProps) {
  return (
    <div className="overview-container">
      <div className="show-mcd-button-container">
        <Button
          style={
            {
              '--show-mcd-button-text-color': showMCD ? 'blue' : 'black',
              '--show-mcd-button-background-color': showMCD
                ? 'lightgrey'
                : 'transparent',
            } as CSSProperties
          }
          child={
            <FontAwesomeIcon
              icon={faProjectDiagram}
              title={showMCD ? 'Hide MCD' : 'Show MCD'}
              width={20}
            />
          }
          onClick={onClickButtonShowMCD}
        />
      </div>
      <div className="show-fragments-button-container">
        <Button
          style={
            {
              '--show-fragments-button-text-color': showFragments
                ? 'blue'
                : 'black',
              '--show-fragments-button-background-color': showFragments
                ? 'lightgrey'
                : 'transparent',
            } as CSSProperties
          }
          child={
            <FontAwesomeIcon
              icon={faCircleNodes}
              title={showFragments ? 'Hide fragments' : 'Show fragments'}
              width={20}
            />
          }
          onClick={onClickButtonShowFragments}
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
              <FontAwesomeIcon
                icon={faAngleDown}
                title="Hide right table part"
              />
            ) : (
              <FontAwesomeIcon
                icon={faAngleRight}
                title="Show right table part"
              />
            )
          }
        />
      </div>
    </div>
  );
}

export default Overview;
