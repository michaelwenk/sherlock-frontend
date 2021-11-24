import './Overview.scss';

import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import Button from '../../elements/Button';
import SelectBox from '../../elements/SelectBox';

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
      <p>{mf}</p>
      <Button
        onClick={() => onChangeShowAdditionalColumns(!showAdditionalColumns)}
        child={
          showAdditionalColumns ? (
            <FaAngleDown className="icon" />
          ) : (
            <FaAngleRight className="icon" />
          )
        }
      />
      <div className="table-view-selection">
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
      </div>
    </div>
  );
}

export default Overview;
