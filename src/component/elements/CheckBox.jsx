/** @jsxImportSource @emotion/react */

function CheckBox({ isChecked, handleOnChange, title, css }) {
  return (
    <div css={css}>
      <label>
        <input type="checkbox" checked={isChecked} onChange={handleOnChange} />
        <span>{title}</span>
      </label>
    </div>
  );
}

export default CheckBox;
