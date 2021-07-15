import React from 'react';
import { TCard, TWordToAdd } from '../../services/english-for-kids-service';

import './admin-panel-word-card.sass';

interface IProps {
  word: TCard;
  onNewItemCancel?: (_id: number) => void;
  onSubmitClick: (data: TWordToAdd) => Promise<string>;
  onDeleteClick: (category: string, _id: number) => void;
}

interface IState {
  isUpdateMode: boolean;
  wordValue: string;
  translationValue: string;
  imgSrc: string;
  img: File | null;
  audioSrc: string;
  audio: File | null;
  previousValue: { word: string; translation: string };
  errorMessage: string;
}

class AdminPanelWordCard extends React.Component<IProps, IState> {
  state: IState = {
    isUpdateMode: this.props.onNewItemCancel ? true : false,
    wordValue: this.props.word.word,
    translationValue: this.props.word.translation,
    audioSrc: this.props.word.audioSrc,
    audio: null,
    img: null,
    imgSrc: this.props.word.imgSrc,
    previousValue: {
      translation: this.props.word.translation,
      word: this.props.word.word,
    },
    errorMessage: '',
  };
  audio!: HTMLAudioElement;

  componentDidUpdate = (prevProps: IProps, prevState: IState) => {
    if (prevProps.word.audioSrc !== this.props.word.audioSrc) {
      this.setState({ audioSrc: this.props.word.audioSrc });
    }

    if (prevProps.word.imgSrc !== this.props.word.imgSrc) {
      this.setState({ imgSrc: this.props.word.imgSrc });
    }

    if (this.state.wordValue.length !== prevState.wordValue.length) {
      if (this.state.wordValue.length === 0)
        this.setState({ errorMessage: 'Word can not be empty!' });
      else this.setState({ errorMessage: '' });
    }

    if (this.state.translationValue.length !== prevState.translationValue.length) {
      if (this.state.translationValue.length === 0)
        this.setState({ errorMessage: 'Translation can not be empty!' });
      else this.setState({ errorMessage: '' });
    }
  };

  render() {
    const { onDeleteClick } = this.props;

    const { imgSrc, errorMessage, audioSrc, isUpdateMode, wordValue, translationValue } =
      this.state;

    return (
      <div className="admin-panel-word-card">
        <div className="word-card__input-wrapper">
          <h4 className="typography-h4">Word</h4>

          <input
            disabled={!isUpdateMode}
            className="admin-panel-word-card__heading"
            value={wordValue}
            onChange={(e) => this.setState({ wordValue: e.target.value })}
          />
        </div>
        <div className="word-card__input-wrapper">
          <h4 className="typography-h4">Translation</h4>

          <input
            disabled={!isUpdateMode}
            className="admin-panel-word-card__heading"
            value={translationValue}
            onChange={(e) => this.setState({ translationValue: e.target.value })}
          />
        </div>
        <div className="word-card__input-wrapper">
          <h4 className="typography-h4">Image</h4>

          <div className="admin-panel-word-card__info-wrapper">
            {!imgSrc ? null : (
              <img src={imgSrc} alt="Word preview" className="admin-panel-word-card__image" />
            )}
            <input
              disabled={!isUpdateMode}
              type="file"
              accept="image/png, image/jpeg, image/svg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  this.setState({ img: e.target.files[0] });
                }
              }}
            />
          </div>
        </div>

        <div className="word-card__input-wrapper">
          <h4 className="typography-h4">Audio</h4>

          <div className="admin-panel-word-card__info-wrapper">
            {!audioSrc ? null : <button onClick={() => this.playSound(audioSrc)}>Play</button>}
            <input
              disabled={!isUpdateMode}
              type="file"
              accept="audio/mp3"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  this.setState({ audio: e.target.files[0] });
                }
              }}
            />
          </div>
        </div>
        <span className="admin-panel-word-card__heading-error-message">{errorMessage}</span>

        <div className="admin-panel-word-card__buttons-wrapper">
          <button
            className="admin-panel-word-card__update-button"
            onClick={this.сancelUpdateButtonClick}
          >
            {isUpdateMode ? 'Cancel' : 'Update'}
          </button>
          <button
            disabled={wordValue.length === 0 || translationValue.length === 0 || !isUpdateMode}
            className="admin-panel-word-card__add-word-button"
            onClick={this.submitClick}
          >
            Submit
          </button>
        </div>
        <button
          className="admin-panel-word-card__delete-button"
          onClick={() => onDeleteClick(this.props.word.category, this.props.word._id)}
        ></button>
      </div>
    );
  }

  playSound = (audioSrc: string) => {
    if (this.audio) this.audio.pause();

    this.audio = new Audio(audioSrc);

    if (!this.audio) return;

    this.audio.play();
  };

  submitClick = async () => {
    const { audio, imgSrc, audioSrc, img, wordValue, translationValue } = this.state;

    const message = await this.props.onSubmitClick({
      _id: this.props.word._id,
      audio: audio ? (audio as File) : undefined,
      imgSrc,
      audioSrc,
      img: img ? (img as File) : undefined,
      word: wordValue.trim(),
      translation: translationValue.trim(),
      category: this.props.word.category,
    });

    this.setState({ errorMessage: message });
    if (!message) this.setState({ isUpdateMode: false });
  };

  сancelUpdateButtonClick = () => {
    const { isUpdateMode, wordValue, translationValue, previousValue } = this.state;
    if (isUpdateMode && this.props.onNewItemCancel) {
      this.props.onNewItemCancel(this.props.word._id);
      return;
    }
    if (isUpdateMode)
      this.setState({
        wordValue: previousValue.word,
        translationValue: previousValue.translation,
      });
    if (!isUpdateMode)
      this.setState({
        previousValue: { word: wordValue, translation: translationValue },
      });

    this.setState(({ isUpdateMode }) => ({ isUpdateMode: !isUpdateMode }));
  };
}

export default AdminPanelWordCard;
