import './Tabs.css';

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
      if (!tab.labelOnly) {
        // ignore the tabs like the logo tab here
        setActiveTab(index);
      }
    },
    [tabsData],
  );

  return useMemo(
    () => (
      <div className="tabs-container">
        <div className="tabs-container-tabs">
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
        {tabsData.map((tab: TabData, index: number) => (
          <div
            className="tab-element"
            key={'tab_element_' + index}
            style={{ display: index === activeTab ? 'block' : 'none' }}
          >
            {tab.elem}
          </div>
        ))}
      </div>
    ),
    [activeTab, handleTabClick, height, tabsData, width],
  );
}

export default Tabs;
