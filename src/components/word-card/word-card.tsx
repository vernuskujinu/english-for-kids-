import React from 'react';
import { connect } from 'react-redux';
import { APP_MODES, GAME_MODES, TAppState } from '../../redux/reducers/reducer';
import { TGameAssets, TCard, TCategory } from '../../services/english-for-kids-service';

import { addAttempt } from '../../redux/actions/actions';

import debounce from 'lodash/debounce';

import './word-card.sass';
import StatisticService from '../../services/statistic-service';

interface IProps {
  card: TCard;
  mode: APP_MODES;
  currentCard: TCard | null;
  addAttempt: typeof addAttempt;
  gameAssets: TGameAssets;
  gameMode: GAME_MODES;
  selectedCategory: TCategory | null;
  categories: TCategory[];
}

interface IState {
  isFlipped: boolean;
}

class WordCard extends React.Component<IProps, IState> {
  state: IState = {
    isFlipped: false,
  };

  audio!: HTMLAudioElement;

  render() {
    const {
      card: { word, translation, imgSrc, isGuessed },
      mode,
    } = this.props;

    const { isFlipped } = this.state;

    const isAppOnPlayMode = mode === APP_MODES.play;

    return (
      <div
        className={`word-card__wrapper ${isGuessed ? 'card--gaussed-correct' : ''}`}
        onMouseLeave={() => !isAppOnPlayMode && this.unflip()}
        onMouseDown={debounce(this.handleCardClick, 200)}
      >
        <div
          className={`word-card ${isFlipped ? 'word-card--flipped' : ''}  ${
            isAppOnPlayMode ? 'word-card--mode-play' : ''
          }`}
        >
          <div className="word-card__front">
            <div className="word-card__image" style={{ backgroundImage: `url(${imgSrc})` }}></div>
            <div className="word-card__descriptions-wrapper">
              <div className="word-card__description-wrapper">
                <span className="word-card__word">{word}</span>
                <button
                  className="word-card__flip-button"
                  onClick={(e) => !isAppOnPlayMode && this.flip(e)}
                  style={{ backgroundImage: `url(assets/svg/repeat.svg)` }}
                ></button>
              </div>
              <div className="word-card__game-mode"></div>
            </div>
          </div>

          <div className="word-card__back">
            <div className="word-card__image" style={{ backgroundImage: `url(${imgSrc})` }}></div>
            <div className="word-card__descriptions-wrapper">
              <div className="word-card__description-wrapper">
                <span className="word-card__word-translation">{translation}</span>
                <div className="word-card__game-mode"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  flip = (e: React.MouseEvent) => {
    this.setState({ isFlipped: true });
  };

  unflip = () => {
    this.setState({ isFlipped: false });
  };

  handleCardClick = () => {
    if (this.state.isFlipped === true) return;

    const isAppOnPlayMode = this.props.mode === APP_MODES.play;

    if (isAppOnPlayMode) {
      this.attempt();
      return;
    }

    StatisticService.increaseWordTrain(this.props.card);

    this.playAudio();
  };

  attempt = () => {
    const isCorrect = this.props.card === this.props.currentCard;

    if (isCorrect) {
      this.audio = new Audio(this.props.gameAssets.correctSoundSrc);

      if (this.props.gameMode === GAME_MODES.game) {
        StatisticService.increaseWordCorrect(this.props.card);
      }
    } else {
      this.audio = new Audio(this.props.gameAssets.incorrecSoundtSrc);

      if (this.props.gameMode === GAME_MODES.game)
        StatisticService.increaseWordIncorrect(this.props.card);
    }

    this.audio.play();
    if (this.props.gameMode === GAME_MODES.game) this.props.addAttempt(isCorrect);
  };

  playAudio = () => {
    const { audioSrc } = this.props.card;

    if (this.audio) this.audio.pause();

    this.audio = new Audio(audioSrc);

    if (!this.audio) return;

    this.audio.play();
  };
}

const mapStateToProps = ({
  mode,
  currentCard,
  gameAssets,
  gameMode,
  selectedCategory,
  categories,
}: TAppState) => {
  return { mode, currentCard, gameAssets, gameMode, selectedCategory, categories };
};

const mapDispatchToProps = {
  addAttempt,
};

export default connect(mapStateToProps, mapDispatchToProps)(WordCard);
