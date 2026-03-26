import './Tab.scss';

import { CSSProperties } from 'react';
import TabData from '../../types/TabData';

type InputProps = {
  tabData: TabData;
  height: CSSProperties['height'];
  width?: CSSProperties['width'];
};

function Tab({ tabData, height, width }: InputProps) {
  const { label, isActive, onClick } = tabData;
  return (
    <div
      className="Tab"
      style={{
        width: width,
        height: height,
        fontWeight: isActive ? 'bold' : 'normal',
        textDecoration: isActive ? 'underline' : 'none',
      }}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

export default Tab;
