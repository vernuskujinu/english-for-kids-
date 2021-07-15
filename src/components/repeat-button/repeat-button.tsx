import React from 'react';

import './repeat-button.sass';

const RepeatButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="button button-repeat" onClick={onClick}>
      <span
        className="button-repeat__icon"
        style={{ WebkitMaskImage: `url(./assets/svg/repeat.svg)` }}
      ></span>
    </button>
  );
};

export default RepeatButton;
