export default interface Highlight {
  isActive: boolean;
  onHover: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  onClick: (e: any) => void;
  show: () => void;
  hide: () => void;
  isActivePermanently: boolean;
  click: (e: any) => void;
  add: (id: any) => void;
  remove: (id: any) => void;
}
