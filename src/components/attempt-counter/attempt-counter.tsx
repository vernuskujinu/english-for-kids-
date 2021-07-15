import React from 'react';

import './attempt-counter.sass';

interface IProps {
  attempts: boolean[];
}

const AttemptCounter = (props: IProps) => {
  const { attempts } = props;

  const items = attempts.map((attempt, index) => (
    <li
      key={index}
      className={`attemps__item attemps__item attemps__item--${attempt ? 'correct' : 'incorrect'}`}
      style={{ WebkitMaskImage: `url(./assets/svg/heart.svg)` }}
    ></li>
  ));

  return (
    <div className="attempts-wrapper">
      <ul className="attempts">{items}</ul>
    </div>
  );
};

export default AttemptCounter;
