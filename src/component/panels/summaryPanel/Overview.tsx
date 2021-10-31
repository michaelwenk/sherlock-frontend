import './Overview.scss';

import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import Button from '../../elements/Button';

interface InputProps {
  mf: string;
  showAdditionalColumns: boolean;
  onChangeShowAdditionalColumns: Function;
}

function Overview({
  mf,
  showAdditionalColumns,
  onChangeShowAdditionalColumns,
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
    </div>
  );
}

export default Overview;
