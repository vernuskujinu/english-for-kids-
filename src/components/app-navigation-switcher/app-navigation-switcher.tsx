import React from 'react';

import './app-navigation-switcher.sass';

interface IProps {
  isNavShown: boolean;
  onButtonSwitch: () => void;
}

const AppNavigationSwitcher = ({ isNavShown, onButtonSwitch }: IProps) => {
  return (
    <div className={`wrapper-menu__container`}>
      <div className={`wrapper-menu ${isNavShown ? 'open' : ''}`} onClick={onButtonSwitch}>
        <div className="line-menu half start"></div>
        <div className="line-menu"></div>
        <div className="line-menu half end"></div>
      </div>
    </div>
  );
};

export default AppNavigationSwitcher;
