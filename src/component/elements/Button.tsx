import './Button.css';

import {
  CSSProperties,
  MouseEvent,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';

type InputProps = {
  onClick: (value: EventTarget) => void;
  child: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  style?: CSSProperties;
};

function Button({
  onClick = () => {},
  child = '',
  className = 'Button',
  disabled = false,
  type = 'button',
  title = '',
  style,
}: InputProps) {
  const handleOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e.target);
    },
    [onClick],
  );

  return useMemo(
    () => (
      <button
        className={className}
        onClick={handleOnClick}
        disabled={disabled}
        type={type}
        title={title}
        style={style}
      >
        {child}
      </button>
    ),
    [child, className, disabled, handleOnClick, style, title, type],
  );
}

export default Button;
