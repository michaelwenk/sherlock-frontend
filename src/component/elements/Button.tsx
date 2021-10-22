import { MouseEvent, useCallback } from 'react';

type InputProps = {
  onClick: Function;
  text: string;
  className?: string;
  disabled?: boolean;
};

function Button({
  onClick,
  text,
  className = 'Button',
  disabled = false,
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
      <button onClick={handleOnClick} disabled={disabled}>
        {text}
      </button>
    </div>
  );
}

export default Button;
