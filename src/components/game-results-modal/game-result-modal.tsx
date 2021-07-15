import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TAppState } from '../../redux/reducers/reducer';

import './game-result-modal.sass';

interface IProps {
  attempts: boolean[];
  looseImageSrc: string;
  looseSoundSrc: string;
  winSoundSrc: string;
  winImageSrc: string;
}

const GameResultModal = (props: IProps) => {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      history.push('/');
    }, 2500);
  }, [history]);

  const mistakes = props.attempts.filter((answer) => answer === false);

  let soundSrc = '';
  let imageSrc = '';
  let message = null;

  if (mistakes.length) {
    soundSrc = props.looseSoundSrc;
    imageSrc = props.looseImageSrc;

    message = (
      <h3 className="typography-h3">
        Nice try! But you made {mistakes.length} {mistakes.length > 1 ? 'mistakes' : 'mistake'}
      </h3>
    );
  } else {
    soundSrc = props.winSoundSrc;
    imageSrc = props.winImageSrc;

    message = <h3 className="typography-h3">You won!</h3>;
  }

  const audio = new Audio(soundSrc);

  audio.play();

  return (
    <div className="game-result-modal__wrapper">
      <div className="game-result-modal">
        {message}
        <div className="game-result__image" style={{ backgroundImage: `url(${imageSrc})` }}></div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  gameAssets: { looseImageSrc, looseSoundSrc, winSoundSrc, winImageSrc },
  attempts,
}: TAppState) => {
  return { looseImageSrc, looseSoundSrc, winImageSrc, winSoundSrc, attempts };
};

export default connect(mapStateToProps)(GameResultModal);
