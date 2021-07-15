import React from 'react';

import './app-header.sass';

import AppNavigationSwitcher from '../app-navigation-switcher/app-navigation-switcher';
import AppModeSwitcher from '../app-mode-switcher/app-mode-switcher';
import { setAppNavShown } from '../../redux/actions/actions';
import { connect } from 'react-redux';
import { TAppState } from '../../redux/reducers/reducer';

interface IProps {
  isAppNavShown: boolean;
  setAppNavShown: typeof setAppNavShown;
}

class AppHeader extends React.Component<IProps, unknown> {
  render() {
    const { isAppNavShown, setAppNavShown } = this.props;

    return (
      <header className="header">
        <AppNavigationSwitcher
          isNavShown={isAppNavShown}
          onButtonSwitch={() => setAppNavShown(!isAppNavShown)}
        />
        <AppModeSwitcher />
      </header>
    );
  }
}

function MapStateToProps({ isAppNavShown }: TAppState) {
  return { isAppNavShown };
}

const mapDispatchToProps = {
  setAppNavShown,
};
export default connect(MapStateToProps, mapDispatchToProps)(AppHeader);
