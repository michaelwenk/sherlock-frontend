import { ReactNode } from 'react';

export default interface TabData {
  label: ReactNode;
  elem: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  labelOnly?: boolean;
}
