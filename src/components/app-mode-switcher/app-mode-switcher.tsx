import React from 'react';
import { connect } from 'react-redux';
import { APP_MODES, TAppState } from '../../redux/reducers/reducer';
import { setAppMode } from '../../redux/actions/actions';

import './app-mode-switcher.sass';

interface IProps {
  mode: APP_MODES;
  setAppMode: typeof setAppMode;
}

const AppModeSwitcher = (props: IProps) => {
  const { mode, setAppMode } = props;

  const isAppOnPlayMode = mode === APP_MODES.play;

  return (
    <label className="app-mode-switcher__label">
      <input
        className="app-mode-switcher__checkbox"
        type="checkbox"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setAppMode(e.target.checked ? APP_MODES.play : APP_MODES.train)
        }
        checked={isAppOnPlayMode}
      ></input>
      <span className="app-mode-switcher__background"></span>
    </label>
  );
};

const mapStateToProps = ({ mode }: TAppState) => {
  return { mode };
};

const mapDispatchToProps = {
  setAppMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppModeSwitcher);
