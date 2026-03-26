import './Tabs.scss';

import { CSSProperties, useCallback, useMemo, useState } from 'react';
import Tab from './Tab';
import TabData from '../../types/TabData';

type InputProps = {
  tabsData: TabData[];
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  initialActiveTabIndex?: number;
};

function Tabs({
  tabsData,
  width,
  height,
  initialActiveTabIndex = 0,
}: InputProps) {
  const [activeTab, setActiveTab] = useState<number>(initialActiveTabIndex);

  const handleTabClick = useCallback(
    (index: number) => {
      const tab: TabData = tabsData[index];
      if (tab.labelOnly) {
        // TODO: handle logo click, e.g., navigate to a homepage
        console.log('Logo clicked');
      } else {
        setActiveTab(index);
      }
    },
    [tabsData],
  );

  return useMemo(
    () => (
      <div className="tabs-container">
        <div className="tabs">
          {tabsData.map((tab: TabData, index: number) => {
            if (tab.labelOnly ?? false) {
              return (
                <Tab
                  key={index}
                  tabData={{
                    label: tab.elem,
                    elem: tab.elem,
                    onClick: () => handleTabClick(index),
                    isActive: false,
                  }}
                  height={height}
                />
              );
            }
            return (
              <Tab
                key={index}
                tabData={{
                  label: tab.label,
                  elem: tab.elem,
                  onClick: () => handleTabClick(index),
                  isActive: index === activeTab,
                }}
                width={width}
                height={height}
              />
            );
          })}
        </div>
        <div>{tabsData[activeTab]?.elem}</div>
      </div>
    ),
    [activeTab, handleTabClick, height, tabsData, width],
  );
}

export default Tabs;
