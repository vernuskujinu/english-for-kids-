import React from 'react';
import { connect } from 'react-redux';
import { GAME_MODES, TAppState } from '../../redux/reducers/reducer';
import { setGameMode } from '../../redux/actions/actions';

import './game-start-button.sass';

interface IProps {
  gameMode: GAME_MODES;
  setGameMode: (gameMode: GAME_MODES) => void;
  onClick: () => void;
}

const GameStartButton = (props: IProps) => {
  const { setGameMode, onClick } = props;

  return (
    <button
      className="button game-start-button"
      onClick={() => {
        setGameMode(GAME_MODES.game);
        onClick();
      }}
    >
      Start
      <span
        className="game-start-button__icon"
        style={{ backgroundImage: `url(./assets/svg/arrow-right.svg)` }}
      ></span>
    </button>
  );
};

const mapStateToProps = ({ gameMode }: TAppState) => {
  return { gameMode };
};

const mapDispatchToProps = { setGameMode };

export default connect(mapStateToProps, mapDispatchToProps)(GameStartButton);
