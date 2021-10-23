import { MouseEvent, useCallback } from 'react';

type InputProps = {
  text: string;
  onClick: Function;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

function Button({
  onClick,
  text,
  className = 'Button',
  disabled = false,
  type = 'button',
}: InputProps) {
  const handleOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick(e.target);
    },
    [onClick],
  );

  return (
    <div className={className}>
      <button onClick={handleOnClick} disabled={disabled} type={type}>
        {text}
      </button>
    </div>
  );
}

export default Button;
