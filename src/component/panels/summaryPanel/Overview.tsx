import './Overview.scss';

import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import Button from '../../elements/Button';
import SelectBox from '../../elements/SelectBox';
import { MF } from 'react-mf';

interface InputProps {
  mf: string;
  additionalColumnTypes: string[];
  showAdditionalColumns: boolean;
  onChangeShowAdditionalColumns: Function;
  selectedAdditionalColumnsAtomType: string;
  onChangeSelectedAdditionalColumnsAtomType: Function;
}

function Overview({
  mf,
  additionalColumnTypes,
  showAdditionalColumns,
  onChangeShowAdditionalColumns,
  selectedAdditionalColumnsAtomType,
  onChangeSelectedAdditionalColumnsAtomType,
}: InputProps) {
  return (
    <div className="overview-container">
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
