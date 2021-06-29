import { MouseEvent, useCallback } from 'react';

type InputProps = {
  onClick: Function;
  text: string;
  className?: string;
};

function Button({
  onClick,
  text,
  className = 'Button',
}: InputProps) {
    const handleOnClick = useCallback(
    (e:  MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick(e.target);
    },
    [onClick],
  );

  return (
    <div className={className}>
    
        <button
          onClick={handleOnClick}
        >
            {text}
        </button>
    </div>
  );
}

export default Button;