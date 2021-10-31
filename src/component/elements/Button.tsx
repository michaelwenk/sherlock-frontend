import { MouseEvent, useCallback } from 'react';

type InputProps = {
  onClick: Function;
  child: string | JSX.Element;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
};

function Button({
  onClick,
  child = '',
  className = 'Button',
  disabled = false,
  type = 'button',
  title = '',
}: InputProps) {
  const handleOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e.target);
    },
    [onClick],
  );

  return (
    <button
      className={className}
      onClick={handleOnClick}
      disabled={disabled}
      type={type}
      title={title}
    >
      {child}
    </button>
  );
}

export default Button;
